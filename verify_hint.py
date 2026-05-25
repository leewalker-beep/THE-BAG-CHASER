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
                "aura": 300,
                "clout": 300,
                "mo": 48,
                "tier": 2,
                "mentalHealth": 100,
                "maxMentalHealth": 100,
                "heat": 0,
                "maxClout": 300,
                "maxAura": 300
            },
            "flex": {
                "penthouse": {"owned": False},
                "logistics": {"owned": False},
                "jet": {"owned": False}
            },
            "seenNotifications": []
        }

        page.add_init_script(f"""
            localStorage.setItem('bag-chaser-save-v1', '{json.dumps(save_data)}');
        """)

        page.goto("http://localhost:5173")
        page.wait_for_selector("text=Your operations are maxed out", timeout=10000)
        print("Hint found successfully.")

        page.screenshot(path="/home/jules/verification/hint_visible.png")
        browser.close()

if __name__ == "__main__":
    run()
