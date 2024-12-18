'use client';

import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import CaesarCipher from '@/util/caesarCipher';
import { useEffect, useState } from 'react';

const VideoPlayer = () => {
    const caesar = new CaesarCipher();
    const searchParams = useSearchParams();
    const search = searchParams.get('message');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 에러 처리 함수

    // let src = caesar.decode(search ?? '');
    let src = '12324';

    // const VideoMessage = () => {
    //     useEffect(() => {
    //         const element = document.querySelector('.vjs-modal-dialog-content');
    //         if (element) {
    //             element.textContent = 'Updated message from DOM manipulation';
    //         }
    //     }, []);

    //     return null; // React 방식이 아닌 경우 렌더링 요소가 필요 없습니다.
    // };

    const VideoMessage = () => {
        const element = document.querySelector('.vjs-modal-dialog-content');
        if (element) {
            element.textContent = 'Video cannot be played. Please try again later.';
        }
    };

    return (
        <CldVideoPlayer
            id="mock_cldVideoo"
            width="412"
            height="732"
            src={src ?? ''}
            onError={(e: any) => {
                VideoMessage(); // DOM 조작
            }}
        />
    );
};

export default VideoPlayer;

// if (e.Player.videojs.error_) {
//     let title = document.querySelector('.error-container');
//     title!.innerHTML =
//         'Houston, we have a problem: ' +
//         e.Player.videojs.error_.message +
//         '. This is the status code: ' +
//         e.Player.videojs.error_.statusCode;
//     title!.style.color = 'red';
// }
