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

# console 4
curl -H "Content-type: application/json" -d '{"email":"a@b.com", "password":"password", "forename":"x","surname":"x",  "roles":[{"code":"caseworker","displayName":"caseworker"}]}' http://localhost:4501/testing-support/accounts
```
