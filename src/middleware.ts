import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { ENUM_HEADER_LOG, getRequestId } from './util/middlewareUtils';

export function middleware(req: NextRequest) {
    const requestId = uuid();
    const res = NextResponse.next();
    req.headers.set(ENUM_HEADER_LOG.REQUEST_ID, requestId);
    res.headers.set(ENUM_HEADER_LOG.REQUEST_ID, requestId);

    logMessage(`Entry : ${req.url}`);
    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

function getFormatDate(): string {
    const date = new Date();
    const pad = (n: number, width = 2) => n.toString().padStart(width, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // 0-indexed
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds(), 3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function logMessage(message: string) {
    const requestId = getRequestId();
    console.log(`🌰 [middleware] ${getFormatDate()} [req-${requestId}] ${message}`);
}
