import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Suspense } from "react";
import { Navbar } from "../components/navbar/Navbar";
import { Loading } from "../components/common/Loading";
import { Toaster } from "react-hot-toast";
import { WebVitals } from "../components/web-vitals/WebVitals";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700", "900"],
	display: "swap",
});

// TODO: Navibar 개선하기
// - [ ] Home route 추가하기
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export const metadata: Metadata = {
	title: "ggrim - Classic Painting Quiz",
	description:
		"enjoy quiz with classic paintings! ggrim is a quiz service that allows you to present quizzes using classic paintings. ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head></head>
			<body className={roboto.className}>
				<Toaster position="top-center" />
				<Suspense fallback={<Loading />}>
					<div className="mb-16">
						<Navbar />
					</div>
					<WebVitals />
					{children}
				</Suspense>
			</body>
		</html>
	);
}
