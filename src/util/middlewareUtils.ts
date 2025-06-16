import { headers } from 'next/headers';

export const ENUM_HEADER_LOG = {
    REQUEST_ID: 'x-request-id',
    INTERNAL_API_KEY: 'x-internal-api-key',
} as const;

export function getRequestId(): string | undefined {
    const headerList = headers();
    return headerList.get(ENUM_HEADER_LOG.REQUEST_ID) ?? undefined;
}
