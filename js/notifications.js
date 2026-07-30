export function requestNotificationPermission() {
    if (!("Notification" in window)) {
        return;
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

export function showTimerEndNotification(bodyMessage) {
    const notification = new Notification("⏰ Time's up!", {
        body: bodyMessage
    });
}
