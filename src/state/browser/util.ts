export function setItemWithExpiry(key: string, value: string, ttlMS: number): boolean {
	const now = new Date();
	const item = {
		value: value,
		expiry: now.getTime() + ttlMS, // ttl (밀리초 단위) 후 만료
	};
	localStorage.setItem(key, JSON.stringify(item));
	return true;
}

export function getItemWithExpiry(key: string): string | undefined {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) {
		return undefined;
	}

	const item = JSON.parse(itemStr);
	const now = new Date();

	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key); // 만료된 경우 삭제
		return undefined;
	}

	return item.value;
}
