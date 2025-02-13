import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import RecoilRootWrapper from '@/recoil/recoil_wrapper';
import { SearchPaintingBar } from '../components/search/SearchPaintingBar';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700', '900'],
    display: 'swap',
});

/*TODO
- Navbar
    - <SearchPaintingBar /> 컴포넌트 On/Off 상태 만들기
    - Home route 추가하기
    -
*/

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
                    <div className="bg-white text-white p-4">
                        <h1 className="text-3xl font-bold text-black mb-4">Navbar Area</h1>
                        <SearchPaintingBar searchTitle="" />
                    </div>
                    {children}
                </RecoilRootWrapper>
            </body>
        </html>
    );
}
