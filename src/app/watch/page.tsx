'use client';

import VideoPlayer from '@/components/videoPlayer';
import { Suspense } from 'react';

// TODO 함수 이름 변경 예정 //412 × 732
function WatchPage() {
    return (
        <div className="flex justify-start min-w-[412px] min-h-[732px] bg-gray-900">
            <section className="w-[412px] h-[732px]">
                <Suspense>
                    <VideoPlayer />
                </Suspense>
            </section>
        </div>
    );
}

export default WatchPage;
