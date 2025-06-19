/**
 * 이미지 URL을 집어 넣으면 그 이미지의 너비와 높이를 반환
 * @param 이미지URL
 * @returns  width:number, height:number
 */
export const getUrlImageSize = (url: string): Promise<{ width: number; height: number }> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			resolve({ width: img.naturalWidth, height: img.naturalHeight });
		};
		img.onerror = () => {
			resolve({ width: 0, height: 0 }); // 로드 실패 시 기본값
		};
		img.src = url;
	});
};
