import { z } from 'zod';

export const businessDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(value + 'T00:00:00Z');
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value &&
      value >= '1900-01-01' &&
      value <= '2200-12-31'
    );
  }, 'Ngày không hợp lệ.');

export function businessDay(date: string | null, now = new Date()) {
  const selected = businessDateSchema.parse(
    date ?? new Date(now.getTime() + 7 * 3600000).toISOString().slice(0, 10)
  );
  const start = new Date(selected + 'T00:00:00+07:00');
  return {
    date: selected,
    start,
    end: new Date(start.getTime() + 86400000),
    timeZone: 'Asia/Ho_Chi_Minh',
  };
}
