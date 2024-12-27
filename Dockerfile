# 1단계: 의존성 설치 및 애플리케이션 빌드
FROM node:22-alpine as builder

LABEL mainainer="ggrim@front"
LABEL version="0.1.0"
LABEL description="test"

# 작업 디렉토리 설정
WORKDIR ./front


# 패키지 파일 복사
COPY . .
RUN pwd && ls
# COPY shared/. ./shared/.

# WORKDIR ./front/



# 의존성 설치

RUN  npm ci  &&  npm run build 


# 2단계: 실행 이미지
FROM node:22-alpine


# 빌드 단계에서 생성된 필수 파일만 복사
COPY --from=builder /front/.next/standalone ./
COPY --from=builder /front/.next/static ./.next/static
COPY --from=builder /front/public ./public


EXPOSE 4000
ENV PORT 4000
# ENV BACKEND_URL ${BACKEND_URL}
ENV BACKEND_URL ${BACKEND_URL}
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
ENV NEXT_PUBLIC_CLOUDINARY_API_KEY ${NEXT_PUBLIC_CLOUDINARY_API_KEY}
ENV CLOUDINARY_API_SECRET ${CLOUDINARY_API_SECRET}



CMD ["node", "server.js"]






