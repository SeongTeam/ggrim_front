'use client';

import VideoPlayer from '@/components/cloudinary/VideoPlayer';
import { Suspense } from 'react';

// 화면 크기 고정 (412 × 732)
function WatchPage() {
	return (
		<div className="flex min-h-[732px] min-w-[412px] justify-start bg-gray-900">
			<section className="h-[732px] w-[412px]">
				<Suspense>
					<VideoPlayer />
				</Suspense>
			</section>
		</div>
	);
}

export default WatchPage;
