from playwright.sync_api import sync_playwright
import time
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        save_data = {
            "bag": 600000000,
            "cancelIntro": True,
            "death": False,
            "player": {"name": "MOGUL JULES", "difficulty": "GRINDER"},
            "stats": {"aura": 300, "clout": 300, "mentalHealth": 100},
            "flex": {},
            "seenNotifications": []
        }

        # Use add_init_script to set localStorage before the app loads
        page.add_init_script(f"""
            localStorage.setItem('bagChaserSave_v2', '{json.dumps(save_data)}');
        """)

        page.goto("http://localhost:5173")

        # Wait for the app to load
        page.wait_for_selector("text=MOGUL JULES", timeout=10000)

        # Click Flex Showcase tab
        page.click("button:has-text('FLEX SHOWCASE')")

        # Wait for transition
        time.sleep(2)

        # Take screenshot
        page.screenshot(path="/home/jules/verification/flex_really_unlocked.png", full_page=True)
        print("Screenshot saved to /home/jules/verification/flex_really_unlocked.png")

        browser.close()

if __name__ == "__main__":
    run()
