FROM node:18-slim

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

EXPOSE 3000

ENTRYPOINT node codeRunner.js

RUN useradd chanwoo -s /bin/sh

USER chanwoo