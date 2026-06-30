import os
from datetime import datetime, date, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from database.connection import db_instance

def calculate_next_sip_date(sip_day: int):
    today = date.today()
    # If today's day is past the sip_day, next SIP is next month
    if today.day > sip_day:
        if today.month == 12:
            next_month = 1
            next_year = today.year + 1
        else:
            next_month = today.month + 1
            next_year = today.year
    else:
        next_month = today.month
        next_year = today.year
    
    # Handle end of month issues (e.g. Feb 30 -> Feb 28)
    try:
        next_sip = date(next_year, next_month, sip_day)
    except ValueError:
        # If the day doesn't exist in the month, just use the last day of the month
        if next_month == 12:
            next_sip = date(next_year, next_month, 31)
        else:
            next_sip = date(next_year, next_month + 1, 1) - timedelta(days=1)
            
    return next_sip

async def add_reminder(user_name, email, sip_date, funds, db):
    existing = await db.reminders.find_one({"email": email})
    
    if existing:
        await db.reminders.update_one(
            {"email": email},
            {"$set": {
                "user_name": user_name,
                "sip_date": sip_date,
                "funds": funds,
                "updated_at": datetime.utcnow().isoformat()
            }}
        )
    else:
        await db.reminders.insert_one({
            "user_name": user_name,
            "email": email,
            "sip_date": sip_date,
            "funds": funds,
            "created_at": datetime.utcnow().isoformat()
        })
        
    next_date = calculate_next_sip_date(sip_date)
    return next_date

async def get_reminder(email, db):
    r = await db.reminders.find_one({"email": email})
    if r:
        next_date = calculate_next_sip_date(r["sip_date"])
        days_until = (next_date - date.today()).days
        total_sip = sum(f["monthly_sip"] for f in r["funds"])
        
        # Convert _id to string
        r["_id"] = str(r["_id"])
        
        return {
            "reminder": r,
            "next_sip_date": next_date,
            "days_until": days_until,
            "total_sip": total_sip
        }
    return None

def send_reminder_email(user_name, email, sip_date, total_amount, funds):
    sender_email = os.environ.get("GMAIL_USER")
    sender_password = os.environ.get("GMAIL_APP_PASSWORD")
    
    if not sender_email or not sender_password:
        print("Email credentials not configured. Skipping email send.")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "FinWise AI — SIP Reminder 🔔"
    msg["From"] = sender_email
    msg["To"] = email

    funds_list = "\n".join([f"- {f['fund_name']}: ₹{f['monthly_sip']}" for f in funds])

    text = f"""Namaste {user_name}!
Aapka SIP {sip_date} ko hai.
Total: ₹{total_amount}
Funds:
{funds_list}
Happy Investing! 🚀"""

    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #00D09C;">FinWise AI SIP Reminder 🔔</h2>
            <p>Namaste <strong>{user_name}</strong>!</p>
            <p>Aapka SIP <strong>{sip_date}</strong> ko hai.</p>
            <p style="font-size: 18px;">Total Investment: <strong>₹{total_amount}</strong></p>
            <h3>Funds:</h3>
            <ul>
                {"".join([f"<li>{f['fund_name']}: ₹{f['monthly_sip']}</li>" for f in funds])}
            </ul>
            <br>
            <p>Happy Investing! 🚀</p>
        </div>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    msg.attach(part1)
    msg.attach(part2)

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

async def check_and_send_reminders():
    print("Checking for SIP reminders...")
    if db_instance.db is None:
        print("DB not connected for reminders.")
        return
        
    cursor = db_instance.db.reminders.find({})
    reminders = await cursor.to_list(length=1000)
    
    today = date.today()
    
    for r in reminders:
        next_date = calculate_next_sip_date(r["sip_date"])
        # Send reminder 3 days before
        target_reminder_date = next_date - timedelta(days=3)
        
        if today == target_reminder_date:
            print(f"Sending reminder to {r['email']} for SIP on {next_date}")
            total_sip = sum(f["monthly_sip"] for f in r["funds"])
            formatted_date = next_date.strftime("%d %b %Y")
            send_reminder_email(r["user_name"], r["email"], formatted_date, total_sip, r["funds"])
