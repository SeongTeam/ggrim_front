import { atom, atomFamily } from 'recoil';

interface ImageMetadata {
    width: string;
    height: string;
}

interface ImageData {
    id: number;
    name: string;
    url: string;
    metadata: ImageMetadata;
}

const getImage = async (id: number): Promise<ImageData> => {
    if (typeof window === 'undefined') {
        // 서버에서 안전한 기본값 반환
        return {
            id,
            name: `Image ${id}`,
            url: '',
            metadata: {
                width: '0px',
                height: '0px',
            },
        };
    }

    // 브라우저에서 실행
    return new Promise((resolve, reject) => {
        const url = `https://res.cloudinary.com/dqsubx7oc/image/upload/w_149,h_104/g_auto/recoil-demo/${id}.png`;
        const image = new Image();
        image.onload = () =>
            resolve({
                id,
                name: `Image ${id}`,
                url,
                metadata: {
                    width: `${image.width}px`,
                    height: `${image.height}px`,
                },
            });
        image.onerror = () => reject(new Error(`Failed to load image at ${url}`));
        image.src = url;
    });
};

export const imageState = atomFamily<ImageData, number>({
    key: 'imageState',
    default: (id: number) =>
        typeof window !== 'undefined'
            ? getImage(id) // 클라이언트에서만 실행
            : {
                  // SSR에서는 안전한 기본값 반환
                  id,
                  name: `Image ${id}`,
                  url: '',
                  metadata: {
                      width: '0px',
                      height: '0px',
                  },
              },
});

export const selectedImageState = atom<number>({
    key: 'selectedImageState',
    default: 1, // 기본값
});

export const imageListState = atom<number[]>({
    key: 'imageListState',
    default: [1, 2, 3], // 기본 이미지 목록
});
