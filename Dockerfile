#stage 1
FROM node:14-alpine as build

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:1.21.0-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/* /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]