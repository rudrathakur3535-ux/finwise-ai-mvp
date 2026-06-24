import httpx, asyncio
async def run():
    r = await httpx.AsyncClient(follow_redirects=True).get('https://www.amfiindia.com/spages/NAVAll.txt', timeout=15)
    print(r.text[:500])
    lines = r.text.split("\n")
    for i in range(50):
        print(repr(lines[i]))

asyncio.run(run())
