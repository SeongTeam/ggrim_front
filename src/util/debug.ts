import assert from 'node:assert';
import { serverLogger } from './serverLogger';
const isDebugMode = process.env.NODE_ENV === 'development';

export function assertOrLog(condition: boolean, message?: string): void {
	if (isDebugMode) {
		assert(condition, message);
		return;
	}

	if (!condition) {
		logAssertionError(message);
	}
}

function logAssertionError(message?: string): void {
	const stack = new Error().stack;
	const callerInfo = stack?.split('\n')[2]?.trim();
	const formattedMessage = `[ASSERTION ERROR] ${message || 'Assertion Failed'} at ${callerInfo}`;

	if (isBrowser()) {
		console.error(formattedMessage);
	} else {
		serverLogger.error(formattedMessage);
	}
}

export function isBrowser() {
	return typeof window !== 'undefined';
}
