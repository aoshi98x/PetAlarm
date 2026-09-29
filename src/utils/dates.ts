export const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const MONTHS_ES_FULL = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nowIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Formats an arbitrary local Date as "YYYY-MM-DD". */
export function toDateIso(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Formats an arbitrary local Date as "YYYY-MM-DDTHH:mm". */
export function toDateTimeIso(date: Date): string {
  return `${toDateIso(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Combines the date of `date` with the time of `time` into "YYYY-MM-DDTHH:mm". */
export function combineDateTimeIso(date: Date, time: Date): string {
  return `${toDateIso(date)}T${formatTimeObj(time)}`;
}

/** Accepts YYYY-MM-DD or an ISO datetime and formats as "12 mar 2025". */
export function formatDate(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}

/** Accepts an ISO datetime and formats as "12 mar 2025, 14:30". */
export function formatDateTime(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Formats an ISO time as "14:30". */
export function formatTime(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Formats a local Date as "12 mar 2025". */
export function formatDateObj(date: Date): string {
  return `${date.getDate()} ${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

/** Formats a local Date as "14:30". */
export function formatTimeObj(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Human age from a birth date, e.g. "2 años" / "8 meses" / "3 semanas". */
export function ageLabel(birthDate?: string): string {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return '';
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years >= 1) return `${years} ${years === 1 ? 'año' : 'años'}`;
  if (months >= 1) return `${months} ${months === 1 ? 'mes' : 'meses'}`;

  const days = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / 86_400_000));
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  return `${days} ${days === 1 ? 'día' : 'días'}`;
}

export const MONTHS_ES_FULL_ARR = MONTHS_ES_FULL;
