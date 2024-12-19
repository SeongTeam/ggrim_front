'use client';

import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { useSearchParams } from 'next/navigation';
import CaesarCipher from '@/util/caesarCipher';

const VideoPlayer = () => {
    const caesar = new CaesarCipher();
    const searchParams = useSearchParams();
    const search = searchParams.get('message');

    const src = caesar.decode(search ?? '');

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
            onError={() => {
                VideoMessage(); // DOM 조작
            }}
        />
    );
};

export default VideoPlayer;
