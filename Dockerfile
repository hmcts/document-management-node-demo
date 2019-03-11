FROM node:alpine as development

WORKDIR /app

COPY package.json .
RUN  npm install

COPY . .
RUN npm install -g @angular/cli@7.3.3 && ng build

EXPOSE 3000
CMD ["npm", "run", "start-dev-proxy", "--", "--proxy-config", "proxy.docker.config.json"]

FROM nginx as production
COPY --from=development /app/dist/rpa-em-demo/main /usr/share/nginx/html
