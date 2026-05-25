from playwright.sync_api import sync_playwright
import time
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        save_data = {
            "ph": "PLAYING",
            "pl": {
                "bag": 1000000000,
                "aura": 500,
                "clout": 500,
                "mo": 48,
                "tier": 5,
                "mentalHealth": 100,
                "maxMentalHealth": 100,
                "heat": 0,
                "maxClout": 1000,
                "maxAura": 1000
            },
            "campaign": {
                "currentWeek": 1,
                "currentMonth": 1,
                "warchest": 10000000000,
                "phase": "POLITICS",
                "regionalPolling": {"blueWall": 35, "rustBelt": 35, "sunBelt": 35},
                "opponentPolling": {"blueWall": 42, "rustBelt": 42, "sunBelt": 42}
            },
            "tab": "WAR_ROOM",
            "isPresident": True,
            "seenNotifications": []
        }

        page.add_init_script(f"""
            localStorage.setItem('bag-chaser-save-v1', '{json.dumps(save_data)}');
        """)

        page.goto("http://localhost:5173")

        # Wait for any text from the campaign screen
        page.wait_for_selector("text=ELECTORAL WAR ROOM", timeout=10000)

        # Check initial values
        print("Initial state loaded.")

        # Perform Rust Belt Rally
        page.click("button:has-text('Run Rust Belt Working-Class Rallies')")
        time.sleep(1)

        # Take screenshot of campaign state
        page.screenshot(path="/home/jules/verification/campaign_action.png")
        print("Screenshot saved to /home/jules/verification/campaign_action.png")

        # Scenario 2: President Overlay
        time.sleep(2)

        # Take screenshot of President Overlay
        page.screenshot(path="/home/jules/verification/president_overlay.png")
        print("Screenshot saved to /home/jules/verification/president_overlay.png")

        # Check if overlay button is present
        overlay_btn = page.query_selector("button:has-text('Executive Order: Access Oval Office')")
        if overlay_btn:
            print("Presidential Overlay Button found.")
        else:
            print("Presidential Overlay Button NOT found.")

        browser.close()

if __name__ == "__main__":
    run()
