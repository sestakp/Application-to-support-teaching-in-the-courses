# Dockerfile for frontend build
# author Vojtěch Kulíšek (xkulis03)
# since 22.12.2023

FROM node:21.5-slim
workdir .
COPY package.json package-lock.json .
RUN npm install 
COPY . .
#ARG ENV
#ENV VUE_APP_API_URL ${ENV}
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
RUN npm run build

FROM httpd:alpine3.17 AS base
EXPOSE 80
FROM base AS final
COPY --from=0 ./dist /usr/local/apache2/htdocs/
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf