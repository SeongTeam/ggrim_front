# ggrim_front Project

## Convention

### Project Structure

-   \*.tsx file는 대문자로 시작한다.

### Code Convention

1. .env를 제외한 전역 상태변수(객체)를 사용하지 않는다.

-   Next.js는 각 사용자의 대한 HTTP 요청을 독립적으로 처리하기 때문에, 전역 상태변수가 공유되지않고 고립되어 여러번 생성될수 있으므로 동작을 예상하기 어렵다
-   서버측에서만 사용하는 전역 상태변수(객체) 또한 예상 밖에 행동할 가능성이 있다.
-   ref : https://github.com/vercel/next.js/issues/49309

2. \*.tsx 형식은 React 컨벤션을 따른다.

-   컴포넌트와 훅은 반드시 순수해야한다.
-   React는 컴포넌트와 훅만 호출한다.
-   훅은 반드시 컴포넌트 함수 최상단에 호출한다.
-   훅은 반드시 React 함수(컴포넌트 함수, 훅 .. 등)에서만 호출한다.
-   ref : https://react.dev/reference/rules

### TODO Convention

-   템플릿은 다음과 같다.
-   // 또는 /\* \*/을 사용한다.

```ts
// TODO: <설명>
// - [ ] <할 일>
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>
```

-   예시

```ts
// TODO: 로그인 폼 UI 개선
// - [ ] 에러 메시지 추가
// - [ ] 버튼 클릭 시 로딩 스피너 표시
// ! 주의: 다크 모드에서 색상이 깨질 가능성 있음
// ? 질문: Tailwind에서 애니메이션 효과 적용하는 방법 고려
// * 참고: https://tailwindcss.com/docs/animation

function LoginForm() {
    return <form>{/* 로그인 폼 */}</form>;
}

// TODO: 유저 인증 기능 구현
// - [ ] JWT 토큰 발급 및 검증
// - [ ] 비밀번호 해싱 및 저장
// ! 주의: refresh token 저장 시 보안 고려 필요
// ? 질문: 세션 방식과 JWT 중 어떤 것이 더 적절할까?
// * 참고: https://docs.nestjs.com/security/authentication

@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

## Build

### Docker Build

```sh
docker build --no-cache \
  --build-arg BACKEND_URL=1234 \
  --build-arg NODE_ENV=1234 \
  -t front-app:latest .
```
