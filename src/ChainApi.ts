import {  JsonRpc } from 'eosjs';
// import fetch from 'node-fetch';

export class ChainApi {

private rpc: any;

constructor(endpoint: string){
  this.rpc = new JsonRpc(endpoint, { fetch });
}

public async getTable(data: any = null): Promise<any> {
    const defaultParams = {
      json: true, // Get the response as json
      code: 'eosio', // Contract that we target
      scope: 'eosio', // Account that owns the data
      table: 'producers', // Table name
      key_type: `i64`, // Type of key
      index_position: 1, // Position of index
      lower_bound: '', // Table secondary key value
      limit: 10, // Here we limit to 10 to get ten row
      reverse: false, // Optional: Get reversed data
      show_payer: false // Optional: Show ram payer
    }
    if (data){ 
      Object.assign({}, defaultParams, data) 
    }
    return await this.rpc.get_table_rows(defaultParams)
  }

}