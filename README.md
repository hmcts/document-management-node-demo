# EM Show

Demonstration app for various EM team products.

## Dev Setup

```
# Login to your HMCTS Account using your Credentials (this will open a browser window)
az login

# Login to Azure Container Registry and Subscribe
az acr login --name hmcts --subscription 1c4f0704-a29e-403d-b719-b90c34ef14c9

# Pull Dependencies down
docker-compose -f docker-compose.yml pull

# Fire up your Containers
docker-compose -f docker-compose.yml up

# Add an IDAM User to your local instance
curl -H "Content-type: application/json" -d '{"email":"a@b.com", "password":"password", "forename":"x","surname":"x",  "roles":[{"code":"caseworker","displayName":"caseworker"}]}' http://localhost:4501/testing-support/accounts
```
# Open your browser
https://localhost:3000

You will be redirected and asked to Login using credentials Username: a@b.com Password: password
