import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import RecoilRootWrapper from '@/components/recoil/recoil_wrapper';
import { Suspense } from 'react';
import Navbar from '../components/navbar/Navbar';
import Loading from '../components/common/Loading';
import { Toaster } from 'react-hot-toast';
import { WebVitals } from '../components/WebVitals';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700', '900'],
    display: 'swap',
});

// TODO: Navibar 개선하기
// - [ ] <SearchPaintingBar /> 컴포넌트 On/Off 상태 만들기
// - [ ] Home route 추가하기
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>


export const metadata: Metadata = {
    title: 'NextJS Tailwind App Presentation Page',
    description:
        'We are thrilled to offer you a Free App Presentation Template, a beautifully designed and user-friendly Tailwind CSS and Material Tailwind theme crafted specifically for app developers like you. The free app presentation template includes key features such as hero, features, FAQ, stats, and testimonial sections.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head></head>
            <body className={roboto.className}>
                <RecoilRootWrapper>
                    <Toaster position="top-center" />
                    <Suspense fallback={<Loading />}>
                        <div className="mb-16">
                            <Navbar />
                        </div>
                        <WebVitals />
                        {children}
                    </Suspense>
                </RecoilRootWrapper>
            </body>
        </html>
    );
}
