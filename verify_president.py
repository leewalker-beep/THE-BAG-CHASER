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
        page.wait_for_selector("text=EXECUTIVE ORDER", timeout=10000)
        print("Presidential Overlay found.")

        page.screenshot(path="/home/jules/verification/president_final.png")
        browser.close()

if __name__ == "__main__":
    run()
