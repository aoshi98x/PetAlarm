import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'catalarm-reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications(): Promise<void> {
  await configureReminderChannel();
  await ensureNotificationPermission();
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;

  const result = await Notifications.requestPermissionsAsync();
  return result.status === 'granted';
}

export async function configureReminderChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Recordatorios de CatAlarm',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function scheduleReminder({
  id,
  title,
  body,
  dateTime,
}: {
  id: string;
  title: string;
  body: string;
  dateTime: string;
}): Promise<string | null> {
  const triggerDate = new Date(dateTime);
  if (Number.isNaN(triggerDate.getTime()) || triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const granted = await ensureNotificationPermission();
  if (!granted) return null;

  return Notifications.scheduleNotificationAsync({
    identifier: `${id}-${Date.now()}`,
    content: {
      title,
      body,
      sound: 'default',
      data: { recordId: id, type: 'reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: CHANNEL_ID,
    },
  });
}
