import os
import json
import httpx
import time
from typing import Dict, Optional
from pydantic import BaseModel

AMFI_URL = "https://www.amfiindia.com/spages/NAVAll.txt"
CACHE_FILE = "data/nav_cache.json"
CACHE_EXPIRY_SECONDS = 43200  # 12 hours

class NAVData(BaseModel):
    nav: float
    date: str

def _is_cache_valid() -> bool:
    if not os.path.exists(CACHE_FILE):
        return False
    file_stat = os.stat(CACHE_FILE)
    age = time.time() - file_stat.st_mtime
    return age < CACHE_EXPIRY_SECONDS

async def fetch_all_navs() -> Dict[str, dict]:
    """Fetches NAV from AMFI and caches it. Returns a dict mapping scheme_code to nav data."""
    if _is_cache_valid():
        try:
            with open(CACHE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass # Fallback to fetching if cache read fails
            
    # Make directory if not exists
    os.makedirs("data", exist_ok=True)
    
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(AMFI_URL, timeout=10.0)
            response.raise_for_status()
            
            nav_dict = {}
            lines = response.text.split("\n")
            
            for line in lines:
                parts = line.strip().split(";")
                # Check if it's a valid data line (needs 6 parts, index 0 is numbers)
                if len(parts) >= 6 and parts[0].isdigit():
                    scheme_code = parts[0]
                    nav_str = parts[4]
                    nav_date = parts[5]
                    
                    try:
                        nav_val = float(nav_str)
                        nav_dict[scheme_code] = {"nav": nav_val, "date": nav_date}
                    except ValueError:
                        continue # Skip invalid NAV values
                        
            # Save to cache
            if nav_dict:
                with open(CACHE_FILE, "w") as f:
                    json.dump(nav_dict, f)
            
            return nav_dict
            
    except Exception as e:
        print(f"Error fetching AMFI data: {e}")
        # Try to return expired cache as ultimate fallback
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, "r") as f:
                    return json.load(f)
            except:
                pass
        return {}

async def get_live_nav(scheme_code: str) -> Optional[dict]:
    """Gets the live NAV for a specific scheme code."""
    navs = await fetch_all_navs()
    return navs.get(str(scheme_code))
