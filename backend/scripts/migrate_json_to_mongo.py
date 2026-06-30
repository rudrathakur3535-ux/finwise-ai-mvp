import os
import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING
import sys

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

async def migrate():
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri or "placeholder" in mongodb_uri:
        print("Error: MONGODB_URI is not set or is a placeholder. Please update backend/.env with your real Atlas connection string.")
        sys.exit(1)

    print("Connecting to MongoDB Atlas...")
    import certifi
    client = AsyncIOMotorClient(mongodb_uri, tlsCAFile=certifi.where())
    db = client.get_database("finwise")
    
    # Check connection
    try:
        await client.admin.command('ping')
        print("Connected successfully!")
    except Exception as e:
        print(f"Failed to connect: {e}")
        sys.exit(1)
        
    print("\nSetting up indexes...")
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.saved_plans.create_index("user_id")
    await db.portfolios.create_index("user_id")
    await db.reminders.create_index("email")
    print("Indexes created.")

    # 1. Migrate Users
    users_file = os.path.join(DATA_DIR, "users.json")
    if os.path.exists(users_file):
        print("\nMigrating Users...")
        with open(users_file, "r") as f:
            users_data = json.load(f)
            
        if users_data:
            # We will insert them if they don't already exist (by email)
            for user in users_data:
                existing = await db.users.find_one({"email": user["email"]})
                if not existing:
                    await db.users.insert_one(user)
            print(f"Users migrated: {len(users_data)}")
        
        os.rename(users_file, f"{users_file}.backup")
        print(f"Renamed users.json to users.json.backup")
    else:
        print("\nNo users.json found.")
        
    # 2. Migrate Saved Plans
    plans_file = os.path.join(DATA_DIR, "saved_plans.json")
    if os.path.exists(plans_file):
        print("\nMigrating Saved Plans...")
        with open(plans_file, "r") as f:
            plans_data = json.load(f)
            
        if plans_data:
            await db.saved_plans.insert_many(plans_data)
            print(f"Saved Plans migrated: {len(plans_data)}")
            
        os.rename(plans_file, f"{plans_file}.backup")
        print(f"Renamed saved_plans.json to saved_plans.json.backup")
    else:
        print("\nNo saved_plans.json found.")
        
    # 3. Migrate Portfolios
    portfolios_file = os.path.join(DATA_DIR, "portfolios.json")
    if os.path.exists(portfolios_file):
        print("\nMigrating Portfolios...")
        with open(portfolios_file, "r") as f:
            try:
                portfolios_data = json.load(f)
                p_list = portfolios_data.get("portfolios", [])
            except json.JSONDecodeError:
                p_list = []
                
        if p_list:
            await db.portfolios.insert_many(p_list)
            print(f"Portfolios migrated: {len(p_list)}")
            
        os.rename(portfolios_file, f"{portfolios_file}.backup")
        print(f"Renamed portfolios.json to portfolios.json.backup")
    else:
        print("\nNo portfolios.json found.")
        
    # 4. Migrate Reminders
    reminders_file = os.path.join(DATA_DIR, "reminders.json")
    if os.path.exists(reminders_file):
        print("\nMigrating Reminders...")
        with open(reminders_file, "r") as f:
            try:
                reminders_data = json.load(f)
                r_list = reminders_data.get("reminders", [])
            except json.JSONDecodeError:
                r_list = []
                
        if r_list:
            await db.reminders.insert_many(r_list)
            print(f"Reminders migrated: {len(r_list)}")
            
        os.rename(reminders_file, f"{reminders_file}.backup")
        print(f"Renamed reminders.json to reminders.json.backup")
    else:
        print("\nNo reminders.json found.")
        
    print("\nMIGRATION COMPLETE! All data is now in MongoDB Atlas.")
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate())
