FROM node:alpine as development

WORKDIR /app

COPY . .
RUN npm install

ARG NODE_ENV_ARG=docker
ENV NODE_ENV=${NODE_ENV_ARG}
RUN npm run build:node

CMD ["npm", "run", "watch-dev-node"]