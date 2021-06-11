# Node Url Shortener

A modern and lightweight URL shortener using Node.js, Fastify, Postgres and Redis.

## Requirements
1. Docker
2. Docker compose

## Getting Started

Create the .env file from .env.example, then fill the variables with the desired values:

```sh
cp .env.example .env
```

Install packages using docker:

```sh
docker run --rm -it \
-v ${PWD}:/usr/src/app \
-w /usr/src/app \
node:16-alpine npm i
```

Windows users should switch the PWD variable to your current directory. Alternatively, you can run npm install as follows:

```sh
docker-compose run --rm api npm install
```

Or if you have node installed in your system, install using npm:

```sh
npm install
```
In the root of project, run:

```sh
docker-compose up -d
```

run the migrations:

```sh
docker-compose run --rm api npm run migrate:up
```

View logs

```sh
docker logs -f api
```

## API URL

- `local`: `http://localhost:3000`

## API Request

| Endpoint                  | HTTP Method             | Description               |
| ------------------------- | :---------------------: | :-----------------------: |
| `/`                       | `GET`                   | `Healthcheck`             |
| `/encode    `             | `POST`                  | `Encode URL`              |
| `/:hash         `         | `GET`                   | `Redirect to encoded URL` |
| `/:hash/stats`            | `GET`                   | `Stats of encoded URL`    |


## Test API locally using curl

- #### Healthcheck

`Request`
```bash
curl -i --request GET 'http://localhost:3000'
```

`Response`
```bash
{
  "message": "Node Url Shortener API is on fire"
}
```

- #### Encode URL

`Request`
```bash
curl -i --request POST 'http://localhost:3000/encode' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "url": "https://github.com/pinceladasdaweb/node-url-shortener",
    "private": false
  }'
```

`Response`
```bash
{
  "url": "https://github.com/pinceladasdaweb/node-url-shortener",
  "alias": "1C",
  "private": false,
  "count": 0,
  "created_at": "2021-06-11T17:39:10.020Z"
}
```

- #### Get Stats of encoded URL

`Request`
```bash
curl -i --request GET 'http://localhost:3000/1C/stats'
```

`Response`
```bash
{
  "count": 16
}
```
