/**
 * DateHelper - Common date utility functions
 */
export class DateHelper {
  static now(): Date {
    return new Date();
  }

  static addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }

  static addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }

  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  static isExpired(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  static formatISO(date: Date): string {
    return date.toISOString();
  }

  static diffInMinutes(start: Date, end: Date): number {
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  }

  static diffInHours(start: Date, end: Date): number {
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  }

  static startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}
