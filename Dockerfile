FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist  /usr/share/nginx/html