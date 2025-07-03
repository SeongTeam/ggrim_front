# Project

## Service

- 고전 예술 작품 관련 퀴즈를 제공

### Demo

- https://port-0-ggrim-front-m4i5o7t86f50fb45.sel4.cloudtype.app/

## Tech Stack

### next.js 14 App router

- Advantage
    1. 프론트 서버 성능 최적화
        - next.js가 제공하는 SSR API를 통해 렌더링 최척화 가능
        - next.js가 제공하는 클라어인트 측과 서버측 캐시를 통해 프론트 서버 부하 감소 가능
    2. 이미지 리로스 최적화
    - next.js가 제공하는 `<Image />` 컴포넌트를 통해 이미리 리소스 렌더링 최적화 및 캐시 가능
    3. 개발 비용 절약
    - next.js는 웹 개발에 필요한 여러가지 메소드 및 컴포넌트를 제공한다.
        - eg : `Route` , `Instrumentation` , `Web-vital` , `Middleware`, `Error handler`, `Api Router` ...
    - next.js 커뮤니티는 다양한 정보와 템플릿 그리고 베스트 프랙티스를 제공한다.
- DisAdvantage
    1. next.js 구조 학습 비용
    - next.js 런타임은 크게 3가지로 나뉘며, 각각의 런타임에 대한 이해와 동작을 알아야 개발 실수를 줄일 수 있다.
        - 서버 런타임은 `Node.js` 그리고 `Edge` 이고 , 클라이언트 런타임은 `browser` 이다.
    2. 개발 환경 설정 비용
    - next.js 문서는 일반적인 케이스만 다룬다.
    - 환경 설정 문서의 내용이 빈약하다.
    - 3rd-party 라이브러리 사용을 위해선 next.js 환경 설정이 필요할 수 있으며, 해당 비용이 적지 않다.

### Tailwind

- Advantage
    1. 빠른 css 사용 가능
    - tailwind는 재사용 가능한 여러가지 css 클래스를 제공한다.
    - 공식문서는 대부분의 클래스 및 프렉티스를 제공한다.
- Disadvantage
    1. tailwind css 클래스 학습 필요
    2. 코드 가독성 저하
    - 컨벤션 또는 린트 없이 사용한다면, css 클래스에 의해 코드 품질이 하락할 수 있다.

## Structure

### app/

- nextjs app router 진입점이다.
- 하위 폴더는 url route를 나타낸다.

### components/

- React 컴포넌트 집합소이다.
- 하위 폴더는 도메인을 나타낸다.
- React 컴포넌트 이외에도, 도메인 관련 함수 객체 또는 상수 객체가 위치한다.

### hook

- 공통 훅 집합소이다.

### route

- 웹 어플리케이션이 제공하는 route 맵 객체 집합소이다.

### util

- 3rd library 집합소이다.

## Convention

### Project Structure

### Code Convention

1. .env를 제외한 전역 상태 객체를 사용하지 않는다.

- Next.js에서는 전역 객체가 공유되지않고 고립되어 여러번 생성될수 있으므로 전역 객체에 저장된 상태가 불확실하다.
    - 이러한 현상은 각 사용자의 대한 HTTP 요청을 독립적으로 처리하는 프레임워크 특성때문이다.
- 서버측에서만 사용하는 전역 객체 또한 예상 밖에 행동할 가능성이 있으므로 사용을 금지한다.
- 전역 객체가 필요한 경우, 프레임워크 외부에 객체를 저장하여 불러오는 방식으로 사용한다.
    - 여기서 외부란, System Local file ,Browser Storage, DB , Cache Storage, backend server, storage serer, ..etc

> nextjs 환경에서 직면할 수 있는 고질적인 어려움을 사전에 회피하기 위해 명시하였다.
>
> - 이에 대한 자세한 설명은 링크를 참조바란다.
> - ref : https://github.com/vercel/next.js/issues/49309

2. 기본적인 이름은 다음 규칙을 따른다.

- 폴더 및 파일

    - 폴더 이름은 `kebab-case`를 사용한다.
    - 파일 이름은 리액트 컴포넌트를 제외하고 `camelCase`를 따른다.
        - 리액트 컴포넌트는 `PascalCase`를 따른다.

    > nextjs 폴더 기반 라우트와 통합하기 위해서 폴더 이름을 kebab-case로 선택하였다.

- 변수 및 함수

    - 헝가리안 표기법을 사용하지 않는다.
    - 객체는 `camelCase`을 따른다.

        - 단, Component는 `PascalCase`를 따른다.

    - `Function Object`는 동사 또는 동사 + 명사 형태로 표현한다.
        - 전치사 생략을 지향한다.
        - 이벤트 핸들러는 `handle` + `<Event-name>` 형태로 표현한다.
        - hook은 `use` + 명사 형태로 표현한다.
        - 참 거짓 판별시 `is` + 명사 형태로 표현한다.
    - 그외 `Object`는 명사 형태로 표현한다.

3. Component 정의시 다음 규칙을 따른다.

- 이름
    - 파일 이름은 명사로 작성하고 `PascalCase` 형식을 따른다.
- 코딩 컨벤션

    - 리액트 컴포넌트는 React 컨벤션을 따른다.

        - 컴포넌트와 훅은 반드시 순수해야한다.
        - React는 컴포넌트와 훅만 호출한다.
        - 훅은 반드시 컴포넌트 함수 최상단에 호출한다.
        - 훅은 반드시 React 함수(컴포넌트 함수, 훅 .. 등)에서만 호출한다.

        > 정해진 관습을 따르는게 코드 품질을 보장한다고 판단하여 선택하였다.
        >
        > - ref : https://react.dev/reference/rules

    - 훅의 의존성 배열은 생략하지 않고 명확히 작성한다.
    - `useEffect`훅 사용시,
        - 콜백 함수는 한가지 작업만 실행한다.
        - `clean up` 함수 반환을 지향한다.
    - 컴포넌트의 Prop을 반드시 정의한다.
        - 컴퍼넌트의 Prop은 Interface를 사용하여 `<Component-name> + Props` 형식으로 정의한다.

- 컴포넌트 파일

    - 하나의 파일은 하나의 컴포넌트만 정의한다.
    - 도메인과 연관된 `components/<domain-name>`에 위치시킨다.
        - 도메인과 연관성이 적다면 `components/common`에 위치시킨다.
        - 연관된 폴더가 없으면, 새폴더에 위치시킨다.
        - 연관된 폴더 내에서 좀더 긴밀하게 묶고 싶다면 하위폴더를 생성하여 위치시킨다.

- Next.js Component
    - `Server Component`는 사용자와 상호작용하지 않는 컴포넌트로 정의한다.
        - Data fetch을 담당한다.
        - hook을 사용하지 않는다.
        - DOM API 사용을 자제한다.
            - hydration 오류 및 빌드 오류가 발생할 수 있다.
        - hook 및 DOM API를 사용이 필요하다면, `Client Component`를 자식 컴포넌트로 추가한다.
        - `page.tsx` ,`layout.tsx` 파일은 `Server Component`로써 사용을 지향한다.
    - `Client Component`는 사용자와 상호작용하는 컴포넌트로 정의한다.
        - `Use client` 문을 파일 최상단에 명시한다.
        - Data mutation을 담당한다.
        - 사용자 상호작용으로 data fetch를 지원할 수 있다.
        - hook을 사용한다.
        - DOM API를 사용한다.

4. hook 정의시 다음 규칙을 따른다.

- 모든 hook은 별도 파일로 저장되며 파일 이름은 `use + PascalCase.ts`형식을 따른다.
- 도메인과 연관된다면, `components/<domain-name>`에 위치시킨다.
- 그 외는 로직과 연관된 `hook`에 위치시킨다.

5. Type 정의 및 명시시 다음 규칙을 따른다.(Props 제외)

- 정의

    - type과 interface 로 정의된 타입은 `PascalCase` 형식으로 정의한다.
    - interface는 객체를 정의할 때 사용한다.

        > interface/type 선택은 상황을 고려한 결과이다.
        >
        > - backend와 front 개발을 함께 진행중이므로, backend에서 interface 사용에 친숙하기 때문에 front에서도 interface를 선택하였다.
        > - interface 병합 문제가 빈번해지면, interface 대신 type을 사용할 예정이다.

    - type은 별칭, 유니언 타입, 인터섹션 타입을 정의할 때 사용한다.
    - 3가지 이상의 파일에서 재사용되는 type 또는 interface는 `src/<main-domain>/<domain-name>/type.ts` 파일에 정의하여 모아둔다.
        - 컴포넌트 또는 도메인과 연관되어 있다면, `src/components/<domain-name>/type.ts`에 정의하여 모아둔다.
        - 백엔드와 연관되어 있다면, `src/server-action/backend/<domain-name>/type.ts`에 정의하여 모아둔다.
    - 그외 type 또는 interface는 사용되는 파일에 정의한다.

- 명시
    - 함수 객체의 인자에는 반드시 타입을 명시한다.
    - 함수 반환 타입은 함수의 반환값이 변경이 여러 로직에 영향을 줄 가능성이 높을 때 명시한다.
        - wrapper 함수의 반환 타입은 명시한다.
    - `unknown`사용을 지향하며 `any`타입 사용은 자제한다.
        - 코드 가독성 향상과 자동 타입 추론 불이익 적다면, `any`타입을 사용한다.
    - `undefined`와 optional property 사용을 지향하며, `null` 사용은 자제한다.
        - `null`은 외부 라이브러리 및 외부 API에서 강제할 때 사용한다.
        - DOM API 사용한 함수의 반환값이 `null`을 반환해야한다면, `undefined`을 사용하도록 한다.
        - DOM API를 사용하여 DOM 요소 참조시, `null`을 강제한다면, `null`을 사용한다.
        - DTO 프로퍼티에는 `null` 사용을 허용한다.
    - 타입을 강제하는 문법 사용은 자제한다.
        - `as`키워드를 사용한 type assertion을 자제한다.
        - `!`키워드를 사용한 non-null assertion operator 사용을 자제한다.
    - 타입을 강제하는 대신 타입을 확인하는 방식을 지향한다.
        - Type Guard Function을 사용하여 타입을 확인한다.
        - `if문`과 `typeof` 키워드 그리고 `in` 키워드를 사용하여 타입을 확인한다.

6. 전역 상수 객체 정의시 다음 규칙을 따른다.

- 전역 상수는 객체 리터럴 정의과 `as const` 키워드를 사용하여 정의한다.

    > ts는 결국 js로 컴파일되므로, js의 자원 및 성능을 고려한 선택이다.
    >
    > - enum 사용은 tree-shaking 미지원 , 컴파일 결과물 용량 증가 문제가 존재한다.

    > 코드 품질 측면에서도 enum은 양방향 맵핑 , Open-ended enum 문제로 타입 안정성이 부족하다.

- 전역 상수의 위치는 문맥과 연광성에 맞는 파일에 위치시킨다.
    - 일반적으로 `const.ts`에 위치시키지만 , 문맥에 맞게 `route.ts` , `header.ts`, `<component-name>.ts` 등에 위치시킨다.

7. server-action은 다음 규칙을 따른다.

- 이름

    - 동사 + 명사 형으로 작성하고, 명사는 도메인을 나타내는 단어를 사용한다.
    - `camelCase` 형태로 정의한다.

- 로직 구조
    - 공통 로직은 wrapper 함수로 재사용한다.
        - 공통 로직이란, 공통 로깅, 특정 쿠기 접근, 특정값 유효성 검사 등
    - 개별 로직은 별도의 함수를 만든다.
    - export 함수는 wrapper 함수와 개별 로직을 조합하여 파이프라인 구조로 로직을 구현한다.
    - next.js `fetch` API 사용을 지향한다.
- server-action 파일
    - `server-only`문을 파일 최상단에 명시한다.
    - 도메인과 연관된 server-action은 `components/<domain-name>/api.ts`에 위치시킨다.
        - 연관된 폴더가 없으면, 새폴더에 위치시킨다.
- dto
    - Request DTO 타입은 `components/<domain-name>/dto.ts`에 위치시킨다.
    - Response DTO 타입은 `components/<domain-name>/type.ts`에 위치시킨다.

8. 그외는 다음 규칙을 따른다.

- `class`와 `namespace` 사용을 자제한다.

> class는 함수형 React 컴포넌트 내부에서 사용시, 실수가 발생할 수 있으므로 자제하는 것이 좋다고 판단하였다.

> namespace를 규칙없이 사용한다면, 모듈 파일의 가독성과 프로젝트의 구조성을 훼손할 수 있다고 판단하여 이러한 선택을 하였다.

- Plain 객체와 Function 객체 정의로 구분을 지향한다.

    - 함수 객체와 정보를 지닌 객체를 프로퍼티로 동시에 갖는 객체를 생성하는 것은 자제한다.

- `prettier`와 `eslint`를 따른다.

### TODO Convention

- TODO는 해야할 일과 관련된 객체 또는 타입 상단 또는 스코프 내부에 위치시킨다.

- TODO가 1개인 경우 다음과 같이 작성한다.

```ts
// TODO: <해야할 일>
// -> <필요한경우 설명 추가>
```

- TODO를 그룹화하는 경우, 다음 양식을 사용한다.
- // 또는 /\* \*/을 사용한다.

```ts
// TODO: <설명>
// - [ ] <할 일>
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>
```

- 예시

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

### Commit convention

1. 전부 영어로 작성한다.
2. 다음 형식을 따른다.

```
<type>(<main-target-folder>): <summary>

[optional body1]
- Explanation A
- Explanation B

[optional body2]
- Explanation A
- Explanation B

[optional footer(s)]
```

- `type`를 명시한다.

    - feat : 어플리케이션 기능 추가/변경/삭제
    - fix : 어플리케이션 버그 수정
    - refactor : 기능 추가/버그 수정 없는 코드 변경
    - style : 코드 동작 및 의미 변경없는 수정(lint, format 등)
    - pref : 어플리케이션 성능 개선
    - chore : 코드 베이스 수정 이외의 작업(빌드 시스템, npm 패키지 설정, 프레임워크 설정, ci/cd 등)
    - docs : 문서 변경

- `main-scope` 명시한다.

    - 커밋의 주제가 되는 tool, lib, domain 등을 의미한다.
    - domain은 `src/`내 하위 폴더를 지칭을 지향한다.

- `summary`는 커밋의 변경 내용을 요약하여 작성한다.

    - 동사 또는 not + 동사로 시작하며, 동사는 소문자, 현재형, 동사 원형으로 작성한다.
    - 마지막에 마침표를 적지 않는다.

- `optional body`는 선택적으로 명시하며 다음 규칙을 따른다.

    - `summary`와 동일하게, 동사 또는 not + 동사로 시작하며, 동사는 소문자, 현재형, 동사 원형으로 작성한다.
    - `summary`에 담지 못한 정보(동기 ,목적 등) 을 명시한다.

- `optional footer`는 선택적으로 명시하며 다음 규칙을 따른다.

    - 주요 변경 사항에 대한 설명은 `BREAKING CHANGE:`을 사용하며 다음 양식을 따른다.

    ```text
    <type>(<main-target-folder>): <summary>

    [optional body1]
    - Explanation A
    - Explanation B

    [optional body2]
    - Explanation A
    - Explanation B

    BREAKING CHANGE: <explanation>
        <Below is optional>
        Before:
            <code-example-before-change>

        After:
            <code-example-after-change>
    ```

    - `BREAKING CHANGE` footer 이외에는 `-`을 사용하여 단어를 연결한다.

- Revet 경우, 다음 규칙을 따른다.

    ```
    revert: <header of reverted commit>

    This reverts commit <hash>

    ```

    - ``로 커밋 메세지를 시작한다.
    -

> 20250623이후 부터 컨벤션을 따르므로, 이전 커밋 메세지로 인한 혼동에 주의해야한다.

> 컨벤션 기반은 [Commit convention](https://www.conventionalcommits.org/en/v1.0.0/)와 [Angular convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)을 참조하였으며, <Scope> 작성은 이전 커밋 메세지 관습을 따랐다.

- 예시

    - 예시: 기능 삭제

    ```text
    feat(app): delete middleware log logic

    prevent infinite loop by instrument
    - either delete util function

    allow developer to not handle middleware edge runtime

    ```

    - 예시: 기능 수정

    ```text
    fix(auth): fix mobile UI layout

    prevent layout from overlapping page content

    BREAKING CHANGE: padding x axis is allowed to be responsive
    ```

## Build

### Docker Build

```sh
docker build --no-cache \
  --build-arg BACKEND_URL=1234 \
  --build-arg NODE_ENV=1234 \
  -t front-app:latest .
```
