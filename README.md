# EM Show

Demonstration app for various EM team products.

## Dev Setup

```
az acr login --name hmcts --subscription 1c4f0704-a29e-403d-b719-b90c34ef14c9
yarn install
docker-compose -f docker-compose-dependencies.yml pull

# console 1
yarn start-dev-node

# console 2
yarn start-dev-proxy

# console 3
docker-compose -f docker-compose-dependencies.yml up
```
