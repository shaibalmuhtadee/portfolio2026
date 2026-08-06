const monthFormatter = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);

  if (!year || !month) {
    throw new Error(`Invalid month value: ${value}`);
  }

  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatRange(start: string, end?: string, current = false): string {
  return `${formatMonth(start)} — ${current ? 'Present' : end ? formatMonth(end) : ''}`;
}
