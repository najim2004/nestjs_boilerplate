/**
 * StringHelper - Common string utility functions
 */
export class StringHelper {
  static randomString(length: number = 8): string {
    const now = Date.now().toString(36);
    const remainingLength = Math.max(length - now.length, 0);

    const randomPart = Array(remainingLength)
      .fill(null)
      .map(() => Math.floor(Math.random() * 36).toString(36))
      .join('');

    return (now + randomPart).slice(0, length);
  }

  static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static lowercaseFirst(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static truncate(str: string, maxLength: number, suffix = '...'): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
  }

  static getReadTime(text: string, wordsPerMinute = 200): number {
    const words = text.split(/\s+/g).length;
    return Math.ceil(words / wordsPerMinute);
  }

  static strPad(
    input: string,
    length: number,
    padString = ' ',
    padType: 'left' | 'right' | 'both' = 'right',
  ): string {
    const inputStr = String(input);

    if (inputStr.length >= length) {
      return inputStr;
    }

    const padLength = length - inputStr.length;
    const padding = padString
      .repeat(Math.ceil(padLength / padString.length))
      .substring(0, padLength);

    switch (padType) {
      case 'left':
        return padding + inputStr;
      case 'both': {
        const leftPad = Math.floor(padLength / 2);
        const rightPad = padLength - leftPad;
        return (
          padString
            .repeat(Math.ceil(leftPad / padString.length))
            .substring(0, leftPad) +
          inputStr +
          padString
            .repeat(Math.ceil(rightPad / padString.length))
            .substring(0, rightPad)
        );
      }
      case 'right':
      default:
        return inputStr + padding;
    }
  }
}
