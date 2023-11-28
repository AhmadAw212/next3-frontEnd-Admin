FROM node:18-alpine as build

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21.0-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/next3 /usr/share/nginx/html

EXPOSE 80


CMD ["nginx","-g","daemon off;"]