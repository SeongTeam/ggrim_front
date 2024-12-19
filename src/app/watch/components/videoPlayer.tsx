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

    let src = caesar.decode(search ?? '');

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
