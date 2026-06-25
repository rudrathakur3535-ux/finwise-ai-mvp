import json
import os
from datetime import datetime, date, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

REMINDERS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "reminders.json")

def load_reminders():
    if not os.path.exists(REMINDERS_FILE):
        os.makedirs(os.path.dirname(REMINDERS_FILE), exist_ok=True)
        return {"reminders": []}
    with open(REMINDERS_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {"reminders": []}

def save_reminders(data):
    os.makedirs(os.path.dirname(REMINDERS_FILE), exist_ok=True)
    with open(REMINDERS_FILE, "w") as f:
        json.dump(data, f, indent=4)

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

def add_reminder(user_name, email, sip_date, funds):
    data = load_reminders()
    
    # Check if user already exists, update if they do
    found = False
    for r in data["reminders"]:
        if r["email"] == email:
            r["user_name"] = user_name
            r["sip_date"] = sip_date
            r["funds"] = funds
            r["updated_at"] = datetime.now().isoformat()
            found = True
            break
            
    if not found:
        data["reminders"].append({
            "user_name": user_name,
            "email": email,
            "sip_date": sip_date,
            "funds": funds,
            "created_at": datetime.now().isoformat()
        })
        
    save_reminders(data)
    next_date = calculate_next_sip_date(sip_date)
    return next_date

def get_reminder(email):
    data = load_reminders()
    for r in data["reminders"]:
        if r["email"] == email:
            next_date = calculate_next_sip_date(r["sip_date"])
            days_until = (next_date - date.today()).days
            total_sip = sum(f["monthly_sip"] for f in r["funds"])
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

def check_and_send_reminders():
    print("Checking for SIP reminders...")
    data = load_reminders()
    today = date.today()
    
    for r in data["reminders"]:
        next_date = calculate_next_sip_date(r["sip_date"])
        # Send reminder 3 days before
        target_reminder_date = next_date - timedelta(days=3)
        
        if today == target_reminder_date:
            print(f"Sending reminder to {r['email']} for SIP on {next_date}")
            total_sip = sum(f["monthly_sip"] for f in r["funds"])
            formatted_date = next_date.strftime("%d %b %Y")
            send_reminder_email(r["user_name"], r["email"], formatted_date, total_sip, r["funds"])
