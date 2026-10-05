/**
 * Date and time formatting helpers
 */

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatNiceDate(dateStr: string): string {
  if (!dateStr) return '';
  const today = getTodayString();
  if (dateStr === today) return 'Today';

  const d = new Date();
  d.setDate(d.getDate() + 1);
  const tomorrow = getTodayString();
  if (dateStr === tomorrow) return 'Tomorrow';

  d.setDate(d.getDate() - 2);
  const yesterday = getTodayString();
  if (dateStr === yesterday) return 'Yesterday';

  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
}

export function getGreeting(userName: string): { title: string; subtitlePrompt: string } {
  const hour = new Date().getHours();
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
  } else if (hour >= 22 || hour < 5) {
    timeOfDay = 'night';
  }

  const title = `Good ${timeOfDay}, ${userName}.`;

  return { title, subtitlePrompt: timeOfDay };
}

export interface DayColumn {
  dateStr: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
  isWeekend: boolean;
}

/**
 * Returns 7 days for current week starting Monday
 */
export function getCurrentWeekDays(baseDate: Date = new Date()): DayColumn[] {
  const todayStr = getTodayString();
  const curr = new Date(baseDate);
  
  // Calculate Monday of current week
  const dayOfWeek = curr.getDay(); // 0 is Sunday
  const distanceToMon = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
  const monday = new Date(curr);
  monday.setDate(curr.getDate() + distanceToMon);

  const week: DayColumn[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = d.getDate();

    week.push({
      dateStr,
      dayName,
      dayNumber,
      monthName,
      isToday: dateStr === todayStr,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }

  return week;
}

export function formatTime12h(time24?: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  if (!hStr) return time24;
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}
