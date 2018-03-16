FROM node:8.1.4

COPY . /tests

WORKDIR /tests
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
RUN npm install yarn -g
RUN yarn install

CMD yarn test:functional:e2e
