# Block Producer Stats Validation Tool
## Validation Features

- Main net ssl & api endpoint validation
- Test net ssl & api endpoint validation
- Check & verify available api features
- Verify Block Producer JSON data

@TODO add validation specifics 

## Installation

@TODO installation & import instructions

- `yarn add <package-name-tbd>`
- `import { getProducerData } from <package-name-tbd>`

## Usage
  
  **Method**
  - `getProducerData( limit, lowerBound, mainNet, testNet )`
  
  **Optional Params**
  - `limit` : #(int) of results to return from query, default 50
  - `lowerBound` : key (string) from previous result to query subsequent data if results exceed limit, default '' 
  - `mainNet` : url (string) for main net, default 'https://mainnet.telos.net'
  - `testNet` : url (string) for test net, default 'https://testnet.telos.net'

  **Return Value**
  - `[BlockProducer[], nextKey]`
  
  - `BlockProducer[]` : array of block producer data properties
  - `nextKey` : string that can be passed as `lowerBound` in subsequent call to get next set of data

  **Example Usage**
``` /* use defaults (50, '', 'https://mainnet.telos.net', 'https://testnet.telos.net') */
    getProducerData();
```

``` // get data about a single block producer
    getProducer(1, 'caleosblocks');
```