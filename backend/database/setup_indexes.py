import pymongo

async def create_all_indexes(db):
    """
    Creates necessary indexes for all collections on startup.
    This ensures queries remain fast as the application scales.
    """
    try:
        # users: unique index on email
        await db.users.create_index("email", unique=True)
        
        # saved_plans: index on user_id
        await db.saved_plans.create_index("user_id")
        
        # portfolios: index on email (or user_id depending on how it's saved)
        await db.portfolios.create_index("email")
        
        # reminders: index on email and sip_date
        await db.reminders.create_index([("email", pymongo.ASCENDING)])
        await db.reminders.create_index([("sip_date", pymongo.ASCENDING)])
        
        print("✅ Database Indexes verified and created successfully.")
    except Exception as e:
        print(f"⚠️ Warning: Failed to create indexes: {e}")
