# Block Producer Validation Tool

## Validation Features

- Main net ssl & api endpoint validation
- Test net ssl & api endpoint validation
- Check & verify available api features
- Verify Block Producer JSON data

## Install

  `npm install @telosnetwork/validator-checks`
  
  `yarn add @telosnetwork/validator-checks`

## Usage

  **Import**
```
//node
import { getProducer, getProducers } from '@telosnetwork/validator-checks';  

//client
import { getProducer, getProducers } from '@telosnetwork/validator-checks/dist/client'; 
```

  **Methods**
```
getProducers( limit: number)

getProducer( owner: string)
```
  
  **Params**
  
  - `limit`(optional) : # of results to return from query, default is 50
  
  - `owner` (required) : block producer account name

  **Return Value**

  - array of block producer data objects

  **Example Usage**
``` 
// get data about first 25 producers
await getProducers(25);

// get data about a single block producer 
await getProducer('caleosblocks');
```

## Build From Source

```
git clone https://github.com/telosnetwork/validator-checks.git
cd validator-checks
yarn

//build for client
yarn build-client

//build for node
yarn build-server

//build for client & node
yarn build-all

```

[NPM page](https://www.npmjs.com/package/@telosnetwork/validator-checks)
