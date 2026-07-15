import os
import motor.motor_asyncio
import logging
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

# Load .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

logger = logging.getLogger(__name__)

class Database:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect_db(cls):
        """Creates a database connection pool."""
        mongodb_uri = os.getenv("MONGODB_URI")
        
        if not mongodb_uri or mongodb_uri.startswith("mongodb+srv://placeholder"):
            logger.warning("MONGODB_URI is not set or is a placeholder. MongoDB connection will fail.")
            
        try:
            import certifi
            # Connect with a timeout to fail fast if credentials/network are bad
            cls.client = motor.motor_asyncio.AsyncIOMotorClient(
                mongodb_uri,
                serverSelectionTimeoutMS=5000,
                maxPoolSize=50,
                minPoolSize=10,
                tlsCAFile=certifi.where()
            )
            cls.db = cls.client.get_database("finwise") # Default database name
            
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB Atlas.")
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            logger.warning("Server will start WITHOUT database. DB-dependent features will be unavailable.")
            cls.client = None
            cls.db = None

    @classmethod
    async def close_db(cls):
        """Closes the database connection pool."""
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed.")

    @classmethod
    async def check_health(cls) -> bool:
        """Health check for the database connection."""
        if not cls.client:
            return False
        try:
            await cls.client.admin.command('ping')
            return True
        except Exception:
            return False

# Create a global instance for easy access
db_instance = Database()

async def get_db():
    """Dependency injection helper for FastAPI."""
    if db_instance.db is None:
        await db_instance.connect_db()
    return db_instance.db
