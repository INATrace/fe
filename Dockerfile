FROM node:14-alpine as build-stage
RUN apk add --update git
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["/bin/sh",  "-c",  "envsubst < /app/assets/env.template.js > /app/assets/env.js && exec nginx -g 'daemon off;'"]
