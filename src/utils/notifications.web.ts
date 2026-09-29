export async function configureNotifications(): Promise<void> {}

export async function scheduleReminder(_reminder: {
  id: string;
  title: string;
  body: string;
  dateTime: string;
}): Promise<null> {
  return null;
}