"use client";

import { useReportWebVitals } from "next/web-vitals";

export const WebVitals = () => {
	useReportWebVitals((metric) => {
		if (process.env.NEXT_PUBLIC_USE_WEB_VITALS) {
			console.warn(`[web-vitals]` + metric);
		}
	});
	return null;
};
