# 베이스 이미지로 node:18-alpine 사용
# 일반 node.js보다 가벼워서 도커 빌드 용량이 감소한다.(1.2GB -> 350MB)
FROM node:18-alpine

# 명령어를 실행할 work dir 생성
RUN mkdir -p /app
WORKDIR /app

# 프로젝트 전체를 work dir로 복사
ADD . /app/

# npm install
RUN npm install

# npm run build
RUN npm run build

# 포트 개방
EXPOSE 3000

# 서버 실행
ENTRYPOINT npm run start:prod