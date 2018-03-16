FROM node:8.1.4

COPY . /tests

WORKDIR /tests
RUN npm install yarn -g
RUN yarn install

CMD yarn test:functional:e2e
