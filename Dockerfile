# 1단계: 의존성 설치 및 애플리케이션 빌드
FROM node:22-alpine AS builder

LABEL mainainer="ggrim@front"
LABEL version="0.1.0"
LABEL description="test"

# -------- 배포에서만 사용-----
ARG BACKEND_URL 
ARG NODE_ENV
# -----------

# 작업 디렉토리 설정
WORKDIR /front


# 패키지 파일 복사
COPY . ./
RUN pwd && ls -la
# 의존성 설치
RUN  npm ci  &&  npm run build 


# 2단계: 실행 이미지
FROM node:22-alpine

# WORK Directory 설정
WORKDIR /app
# 빌드 단계에서 생성된 필수 파일만 복사
COPY --from=builder /front/.next/standalone ./
COPY --from=builder /front/.next/static ./.next/static
COPY --from=builder /front/public ./public
# RUN mkdir ./logs && mkdir ./logs/app
RUN chown -R node:node /app

EXPOSE 4000

ENV BACKEND_URL=${BACKEND_URL}
ENV NODE_ENV=${NODE_ENV}

USER node


CMD ["node", "/app/server.js"]






