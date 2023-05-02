## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Docker

```bash
# container build and start
$ docker compose up

# container build and start in the background
$ docker compose up -d

# logs
$ docker logs api
```

## Migrations

```bash
# create migrations
yarn migration:create -- --name user
# run migrations
yarn migration
# undo last migration
yarn migration:undo
# undo all migrations
yarn migration:undo:all
```

## Seeders
```bash
# create seeder
yarn seed:create -- --name user
# run seeds
yarn seed
# undo all seeds
yarn seed:undo:all
# undo one specific seed
yarn seed:undo --seed 20230316151419-user.ts
```