'use client';
import { RecoilRoot } from 'recoil';
// import { ThemeProvider } from '@material-tailwind/react';

interface RecoilRootWrapperProps {
	children: React.ReactNode;
}

export const RecoilRootWrapper = ({ children }: RecoilRootWrapperProps) => {
	return <RecoilRoot>{children}</RecoilRoot>;
};
