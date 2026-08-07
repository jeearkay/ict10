/**
 * Browser-based notification system for Guna: ICT Tutor.
 * Reminds students to check their study room or continue a pending quest
 * if they haven't logged in for 48 hours.
 */

const STORAGE_KEY_LAST_ACTIVE = 'guna_last_active_timestamp';
const STORAGE_KEY_NOTIF_ENABLED = 'guna_notifications_enabled';
const STORAGE_KEY_LAST_NOTIFIED = 'guna_last_notified_timestamp';

export interface InactivityStatus {
  isInactive: boolean;
  inactiveHours: number;
  lastActiveDate: Date | null;
  notificationPermission: NotificationPermission | 'unsupported';
  notificationsEnabled: boolean;
}

/** Check if Web Notifications API is supported by the browser */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** Get current permission status ('granted', 'denied', 'default', or 'unsupported') */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/** Request user permission for Web Notifications */
export function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) {
    return Promise.resolve('unsupported');
  }

  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      localStorage.setItem(STORAGE_KEY_NOTIF_ENABLED, 'true');
    } else {
      localStorage.setItem(STORAGE_KEY_NOTIF_ENABLED, 'false');
    }
    return permission;
  });
}

/** Record user activity timestamp (e.g. on login, level completion, app interaction) */
export function recordUserActivity(): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, Date.now().toString());
  } catch (e) {
    console.error('Failed to record user activity timestamp', e);
  }
}

/** Set notification preferences explicitly */
export function setNotificationsEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY_NOTIF_ENABLED, enabled ? 'true' : 'false');
}

/** Check if notifications are enabled in app preferences */
export function areNotificationsEnabled(): boolean {
  if (!isNotificationSupported()) return false;
  const stored = localStorage.getItem(STORAGE_KEY_NOTIF_ENABLED);
  if (stored !== null) {
    return stored === 'true' && Notification.permission === 'granted';
  }
  return Notification.permission === 'granted';
}

/** Check inactivity status against a given threshold in hours (default 48 hours) */
export function checkInactivityStatus(thresholdHours: number = 48): InactivityStatus {
  const lastActiveStr = localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);
  const now = Date.now();
  
  if (!lastActiveStr) {
    // If no record exists yet, record now as baseline
    recordUserActivity();
    return {
      isInactive: false,
      inactiveHours: 0,
      lastActiveDate: new Date(),
      notificationPermission: getNotificationPermission(),
      notificationsEnabled: areNotificationsEnabled()
    };
  }

  const lastActiveTimestamp = parseInt(lastActiveStr, 10);
  const diffMs = now - lastActiveTimestamp;
  const inactiveHours = Math.floor(diffMs / (1000 * 60 * 60));
  const isInactive = inactiveHours >= thresholdHours;

  return {
    isInactive,
    inactiveHours,
    lastActiveDate: new Date(lastActiveTimestamp),
    notificationPermission: getNotificationPermission(),
    notificationsEnabled: areNotificationsEnabled()
  };
}

/** Send immediate browser notification */
export function sendBrowserNotification(
  title: string,
  body: string,
  tag: string = 'guna-study-reminder'
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const options: NotificationOptions = {
      body,
      icon: '/favicon.ico',
      tag,
      requireInteraction: false,
    };

    const notification = new Notification(title, options);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    localStorage.setItem(STORAGE_KEY_LAST_NOTIFIED, Date.now().toString());
    return true;
  } catch (e) {
    console.error('Error firing browser notification:', e);
    return false;
  }
}

/**
 * Check inactivity and trigger reminder notification if user has been inactive for >= 48 hours.
 * Also ensures we don't spam notifications repeatedly within 24 hours of last reminder.
 */
export function checkAndTrigger48hReminder(thresholdHours: number = 48): {
  triggeredNotification: boolean;
  isInactive: boolean;
  inactiveHours: number;
} {
  const status = checkInactivityStatus(thresholdHours);
  
  if (!status.isInactive) {
    return { triggeredNotification: false, isInactive: false, inactiveHours: status.inactiveHours };
  }

  const lastNotifiedStr = localStorage.getItem(STORAGE_KEY_LAST_NOTIFIED);
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // Prevent sending duplicate notifications within 24 hours
  if (lastNotifiedStr) {
    const lastNotifiedMs = parseInt(lastNotifiedStr, 10);
    if (now - lastNotifiedMs < ONE_DAY_MS) {
      return { triggeredNotification: false, isInactive: true, inactiveHours: status.inactiveHours };
    }
  }

  const title = '🇧🇹 Class 10 ICT Quest Reminder!';
  const body = `It's been over ${status.inactiveHours} hours since your last ICT quest! Check your Study Room & resume your Python practice to maintain your streak.`;

  const triggered = sendBrowserNotification(title, body, 'guna-48h-study-reminder');
  return { triggeredNotification: triggered, isInactive: true, inactiveHours: status.inactiveHours };
}

/** Utility to simulate 48+ hours of inactivity for testing & auditing */
export function simulateInactivity(hours: number = 49): void {
  const simulatedTime = Date.now() - hours * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, simulatedTime.toString());
  // Clear last notified timestamp so a notification can fire immediately
  localStorage.removeItem(STORAGE_KEY_LAST_NOTIFIED);
}
