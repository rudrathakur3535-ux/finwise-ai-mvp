import asyncio
from services.amfi_fetcher import get_live_nav

async def main():
    print("Fetching live NAV for Axis Bluechip Fund (120503)...")
    res = await get_live_nav("120503")
    print(res)

if __name__ == "__main__":
    asyncio.run(main())
