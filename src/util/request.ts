import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export const X_HEADER_FIELD = {
	REQUEST_ID: 'x-request-id',
	INTERNAL_API_KEY: 'x-internal-api-key',
} as const;

export function getRequestId(): string | undefined {
	const headerList = headers();
	return headerList.get(X_HEADER_FIELD.REQUEST_ID) ?? undefined;
}

export function setRequestId(id: string, req: NextRequest) {
	req.headers.set(X_HEADER_FIELD.REQUEST_ID, id);
}
