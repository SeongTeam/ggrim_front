/**
 *  동일한 타입의 파라미터가 들어오면 셔플과 합친
 * 새로운 변수 리턴 (매번 동작할때가 아닌 시드 기반 랜덤 함수)
 * @param arr1
 * @param arr2
 * @returns
 */
export function shuffleMerge<T>(arr1: T[], arr2: T[]): T[] {
	const mergedArray: T[] = [...arr1, ...arr2];

	// 현재 분 단위로 고정된 시드 생성
	const currentTime = new Date();
	const seed = Math.floor(currentTime.getTime() / 1000 / 60); // 분 단위 시드

	// 시드 기반 랜덤 함수
	function seededRandom(seed: number): number {
		const x = Math.sin(seed) * 10000;
		return x - Math.floor(x);
	}

	// Fisher-Yates 알고리즘으로 배열을 랜덤하게 섞음
	for (let i = mergedArray.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(seededRandom(seed + i) * (i + 1));
		[mergedArray[i], mergedArray[randomIndex]] = [mergedArray[randomIndex], mergedArray[i]];
	}

	return mergedArray;
}
