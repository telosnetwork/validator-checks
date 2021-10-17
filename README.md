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
  - `getProducerData( limit: number, lowerBound: string, mainNet: string, testNet: string )`
  
  **Optional Params**
  - `limit` : # of results to return from query, default 50
  - `lowerBound` : key from previous result to query subsequent data if results exceed limit, default '' 
  - `mainNet` : url for main net, default 'https://mainnet.telos.net'
  - `testNet` : url for test net, default 'https://testnet.telos.net'

  **Return Value**
  - `{ data: BlockProducer[], key: string }`
  - `BlockProducer[]` : array of block producer composite data objects
  - `nextKey` : passed as `lowerBound` in subsequent call to get next set of data

  **Example Usage**
``` 
    // use defaults (50, '', 'https://mainnet.telos.net', 'https://testnet.telos.net') 
    await getProducerData();
```
``` 
    // get data about a single block producer 
    await getProducerData(1, 'caleosblocks');
```
``` 
    // get next set of data
    const firstSet = await getProducerData(3); 
    const secondSet = await getProducerData(3, firstSet.key);
```