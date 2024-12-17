'use client';

import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { useRouter } from 'next/router';

const VideoPlayer = () => {
    const src: string = 'On_a_throne_of_velvet_he_sits_all_alone_dwvwtl';

    // const router = useRouter();
    // const { message } = router.query;
    return (
        <CldVideoPlayer
            id="mock_cldVideoo"
            width="412" //412 × 732
            height="732"
            src={src}
        />
    );
};

export default VideoPlayer;
