import { InputKeyValue } from './const';

export const paramDelimiter = ':';

export function parseKeyValue(input: string): { key: string; value: string } | undefined {
    const match = input.match(/^([^:\s]+):(.+)$/);
    if (match) {
        const [, key, value] = match;
        return { key, value };
    }
    return undefined;
}

export function extractQuotedStrings(input: string): string[] {
    const regex = /"([^"]*?)"/g;
    const result: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(input)) !== null) {
        result.push(match[1]);
    }

    return result;
}

export function extractUnquotedStrings(input: string): string[] {
    const quotedRegex = /"[^"]*"/g;
    const result: string[] = [];

    // quoted 부분을 제거하고 남은 텍스트를 공백으로 나눔
    const unquoted = input.replace(quotedRegex, '|||'); // 따옴표 영역 마커 처리
    for (const part of unquoted.split('|||')) {
        const tokens = part.trim().split(/\s+/).filter(Boolean);
        result.push(...tokens);
    }

    return result;
}

export function makeQuoted(str: string): string {
    return `"${str}"`;
}

export function extractValuesInsideQuoted(str: string, key: InputKeyValue): string[] {
    const regex = new RegExp(`"${key}:(.*?)"`, 'g');
    const values: string[] = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        values.push(match[1]);
    }
    return values;
}

export function extractValues(param: string, key: InputKeyValue): string[] {
    const regex = new RegExp(`${key}:(\\S+)`, 'g');
    const values: string[] = [];
    let match;
    while ((match = regex.exec(param)) !== null) {
        values.push(match[1]);
    }
    return values;
}

export function getInsideDoubleQuotes(text: string, cursorPosition: number): string | undefined {
    if (cursorPosition < 0 || cursorPosition >= text.length) return undefined;

    let start = -1;
    let end = -1;
    let quoteCount = 0;

    for (let i = 0; i <= cursorPosition; i++) {
        if (text[i] === '"') {
            quoteCount++;
            if (quoteCount % 2 === 1) {
                start = i;
            } else {
                end = i;
            }
        }
    }

    if (quoteCount % 2 === 1 && start !== -1) {
        for (let i = cursorPosition + 1; i < text.length; i++) {
            if (text[i] === '"') {
                end = i;
                break;
            }
        }

        if (end !== -1) {
            return text.slice(start + 1, end);
        }
    }

    return undefined;
}
