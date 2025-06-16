import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { ENUM_HEADER_LOG } from './util/middlewareUtils';

export function middleware(req: NextRequest) {
    const requestId = uuid();
    req.headers.set(ENUM_HEADER_LOG.REQUEST_ID, requestId);

    // const requestInfo = {
    //     time: getFormatDate(),
    //     method: req.method,
    //     pathName: req.nextUrl.pathname,
    //     search: req.nextUrl.search,
    // };

    // logMessage(requestId, `Entry.`, requestInfo);
    const res = NextResponse.next();
    res.headers.set(ENUM_HEADER_LOG.REQUEST_ID, requestId);

    return res;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// function logMessage(requestId: string, message: string, info?: Record<string, any>) {
//     const body = {
//         context: `🌰middleware`,
//         requestId,
//         message,
//         ...info,
//     };
//     const headers = {
//         'Content-Type': 'application/json',
//         [ENUM_HEADER_LOG.INTERNAL_API_KEY]: process.env.INTERNAL_LOG_API_KEY!,
//     };
//     const url = `${process.env.BASE_URL}/api/log`;
//     fetch(url, {
//         method: 'POST',
//         body: JSON.stringify(body),
//         headers,
//     }).catch(() => console.error(`middleware log fail. `, body));
// }

// function getFormatDate(): string {
//     const date = new Date();
//     const pad = (n: number, width = 2) => n.toString().padStart(width, '0');

//     const year = date.getFullYear();
//     const month = pad(date.getMonth() + 1); // 0-indexed
//     const day = pad(date.getDate());

//     const hours = pad(date.getHours());
//     const minutes = pad(date.getMinutes());
//     const seconds = pad(date.getSeconds());
//     const milliseconds = pad(date.getMilliseconds(), 3);

//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
// }
