# Block Producer Stats Validation Tool
## Validation Features

- Main net ssl & api endpoint validation
- Test net ssl & api endpoint validation
- Check & verify available api features
- Verify Block Producer JSON data

@TODO add validation specifics 

## Installation

- `yarn add validator-checks`
- `import { getProducer, getProducers } from validator-checks`

## Usage
  
  **Methods**
  - `getProducers( limit: number)`
  - `getProducer( owner: string)`

  
  **Optional Params**
  - `limit` : # of results to return from query, default 50
  - `owner` : block producer account name

  **Return Value**
  - array of block producer data objects
  @TODO add full object details

  **Example Usage**
``` 
    // get data about first 25 producers
    await getProducers(25);
```
``` 
    // get data about a single block producer 
    await getProducer('caleosblocks');
```

## Build From Source

```
get clone https://github.com/telosnetwork/validator-checks.git
cd validator-checks
yarn

//build for client
yarn esbuild src/index.ts --bundle --minify --sourcemap=external --outfile=dist/esbuild/index.js 

//build for node
yarn esbuild src/index.ts --bundle --platform=node --minify --sourcemap=external --outfile=dist/esbuild/index.js 

```


