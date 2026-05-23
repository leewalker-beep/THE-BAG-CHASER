# Notification & Interruption System: Architectural Breakdown

## 1. System Architecture
The system follows an **Observer/Mediator** pattern to decouple game logic from the UI presentation.

### Components:
- **Stat Listener (GameEngine.jsx):** A `useEffect` hook that monitors core player stats (`pl.bag`, `pl.aura`, etc.) every state change. It acts as the "Brain" that decides when a threshold is met.
- **Notification Manager (GameEngine.jsx):** Provides `triggerNotification(id)` and `closeNotification()` functions.
    - `triggerNotification`: Handles **Anti-Spam** logic by checking a `seenNotifications` array before firing. It fetches narrative data from `NOTIFICATION_DATABASE` and sets the `activeNotification` state.
    - `closeNotification`: Resets the active notification and releases the game freeze.
- **Interrupt State (`gBusy`):** When a notification is active, `gBusy` is set to `true`, which globally disables high-frequency interaction buttons (via the `FlashBtn` primitive).
- **UI Injector (NotificationOverlay.jsx):** A dedicated React component that renders the `activeNotification` data. It uses high-z-index styling to ensure it is the topmost layer.

## 2. Step-by-Step Logic
1. **Detection:** The `useEffect` in `GameProvider` detects a condition (e.g., `pl.bag < 0`).
2. **Evaluation:** `triggerNotification('BAG_FAIL_01')` is called.
3. **Filtering:** The system checks `seenNotifications`. If the ID exists, it ignores the call (preventing spam).
4. **State Update:** The ID is added to `seenNotifications`, `activeNotification` is populated with row data, and `gBusy` is set to `true`.
5. **Presentation:** `App.jsx` detects `activeNotification` is truthy and mounts `<NotificationOverlay />`.
6. **Resolution:**
    - **Close:** Player clicks "DEAL WITH IT" -> `closeNotification()` -> `activeNotification` becomes `null` -> `gBusy` becomes `false`.
    - **Share:** Player clicks "Export receipts" -> Replacement logic swaps `[PlayerName]` with `alias` -> Mock share triggered.

## 3. Troubleshooting Guide
If pop-ups are invisible or failing:
- **Canvas Sorting:** The overlay uses `z-[400]`. Ensure no other elements (modals, impact text) exceed this value unless intentionally overlaying the notification.
- **Null References:** The overlay checks `if (!activeNotification) return null`. If a Trigger ID is passed that doesn't exist in `notifications.js`, it will fail silently. Check `NOTIFICATION_DATABASE` keys.
- **Event Unsubscription:** Since this uses React Context and hooks, "unsubscription" isn't a manual process, but ensure `useEffect` dependencies in `GameEngine.jsx` are correct (`pl`, `activeNotification`).
- **Persistence Trap:** `seenNotifications` are saved to `localStorage`. To re-trigger a notification for testing, you must either call `performHardReset()` or manually clear the `seenNotifications` array in the save data.
- **Busy Lock:** If `gBusy` remains `true` after a pop-up closes, ensure `closeNotification` is being called correctly and no other systems are fighting for the `gBusy` lock.
