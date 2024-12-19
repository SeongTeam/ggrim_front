import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';

export async function GET(req: NextRequest) {
    const path =
        __dirname.replace('.next/server/app/api/mcq', 'src/app') + '/data/selected-paintings.json'; //.next/server is the path to the build folder that is created when you run next command
    const fileBuffer = await fs.readFile(path);
    const json = JSON.parse(fileBuffer.toString());
    return NextResponse.json(json);
}
