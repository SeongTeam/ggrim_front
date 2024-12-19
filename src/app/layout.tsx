import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import RecoilRootWrapper from '@/recoil/recoil_wrapper';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700', '900'],
    display: 'swap',
});

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
                <RecoilRootWrapper>{children}</RecoilRootWrapper>
            </body>
        </html>
    );
}
