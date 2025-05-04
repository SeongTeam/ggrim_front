import { serverLogger } from '../../util/logger';

export function getServerUrl(): string {
    const url = process.env.BACKEND_URL;
    serverLogger.info(`BACKEND_URL=${url} `);

    if (url == undefined) {
        console.error(` 'process.env.BACKEND_URL' not read`);
        return '';
    }
    return url;
}

// TODO: HTTP API 에러 핸들링 로직 추가
// - [ ] : fetch()가 반환한 응답 상태 확인 및 에러 핸들링 로직 추가
// - [ ] : fetch() 동작 도중 발생하는 에러 핸들링 로직 추가
// - [ ] : fetch() 오류 발생시, front-end의 요청을 추적하기 위해서 request-id 추가하기
//  -> 또는 backend에서 반환한 응답에 백엔드의 request ID 삽입하기.
// - [ ] : fetch() 타임 아웃 로직 추가하기.
//  -> 백엔드 서버의 응답이 없는 경우, 타임아웃 및 에러 핸들러 로직 필요
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export interface IPaginationResult<T> {
    data: T[];
    count: number;
    pagination: number;
    isMore?: boolean;
}
