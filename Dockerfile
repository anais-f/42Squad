FROM node:24-alpine3.21

WORKDIR /app

COPY ./srcs ./srcs
COPY package*.json .

RUN npm install

ENTRYPOINT [ "node", "./srcs/index.js" ]
