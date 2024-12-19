import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';

// export async function GET(req: NextRequest) {
export async function GET() {
    const path =
        __dirname.replace('.next/server/app/api/artwork_week', 'src/app') +
        '/data/artwork_week-paintings.json'; //.next/server is the path to the build folder that is created when you run next command
    const fileBuffer = await fs.readFile(path);
    const json = JSON.parse(fileBuffer.toString());
    return NextResponse.json(json);
}
