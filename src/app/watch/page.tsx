import VideoPlayer from './components/videoPlayer';

// TODO 함수 이름 변경 예정 //412 × 732
export default async function WatchPage() {
    return (
        <div className="flex justify-start min-w-[412px] min-h-[732px] bg-gray-900">
            <section className="w-[412px] h-[732px]">
                <VideoPlayer />
            </section>
        </div>
    );
}
