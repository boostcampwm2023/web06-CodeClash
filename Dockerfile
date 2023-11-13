FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN npm install

EXPOSE 3000

ENTRYPOINT npm start