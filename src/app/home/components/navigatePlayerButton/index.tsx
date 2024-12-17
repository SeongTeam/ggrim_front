import * as Icons from '@/components/ui/icons';
import exp from 'constants';
import { useCallback, useState } from 'react';

interface DisplayMusicPlayerButtonProps {
    isDisplay: boolean;
    src: string;
}

const NavigatePlayerButton = ({ isDisplay, src }: DisplayMusicPlayerButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // TODO modify domain path on .env
    const openSmallWindow = useCallback(() => {
        const message = 'Hello,_this_is_a_string!';

        //TODO change domain URL not use localhost
        const windowFeatures = 'width=412,height=732,top=100,left=100'; // 412 × 732
        const encodedMessage = encodeURIComponent(message); // 쿼리 파라미터로 안전하게 전달
        const url = `http://localhost:3000/watch?message=${encodedMessage}`;

        window.open(url, '_blank', windowFeatures);
    }, []);

    return isDisplay === true ? (
        <div>
            <button
                onClick={openSmallWindow}
                className="absolute right-2 top-7 transform -translate-y-1/2 bg-black/20 text-black p-2 rounded-md"
            >
                <Icons.Headphones />
            </button>
            {/* Fullscreen Modal */}
            {isOpen && <></>}
        </div>
    ) : (
        <></>
    );
};

export default NavigatePlayerButton;
