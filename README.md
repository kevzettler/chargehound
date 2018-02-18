# Chargehound music store integration
live demo at: [https://stormy-beyond-98142.herokuapp.com/](https://stormy-beyond-98142.herokuapp.com/)

## Overview
The entry point to the application is `/index.js`. This bootstraps an `express.js` server which loads API endpoints from the `/api` directory. The Frontend is a `next.js` that loads pages from the `/pages` directory.

## Installation
Clone this repository with `git clone`

Install dependencies with:
``` bash
npm install
```
run tests with `npm test`


## Configuration
The application takes the following configuration values passed from the host shell environment.

``` bash
CHARGEHOUND_KEY=
STRIPE_SECRET_KEY=
STRIPE_P_KEY=
PORT=
```

Either `export` these configuration values to your shell environment or prefix the following comands with them before execution

## Development
Start the development server with `npm run dev` make sure to prefix it with the configuration.

``` bash
CHARGEHOUND_KEY=<your ch key> STRIPE_SECRET_KEY=<your stripe key> STRIPE_P_KEY=<stripe public key> PORT=<port number> npm run dev
```

## Production
The `master` branch is deployable via Heroku. This requires the environment configuration values to be set on Heroku.
