import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { ApiParams } from './types/ApiParams';

class ChainApi {

private rpc: any;

constructor(endpoint: string, fetch: any){
  this.rpc = new JsonRpc(endpoint, { fetch });
}

public async getTable(params: ApiParams): Promise<any> {
    return await this.rpc.get_table_rows(params)
  }

  public async getProducers(): Promise<any> {
    const params = {
      json: true, 
      code: 'eosio', 
      scope: 'eosio',
      table: 'producers', 
      key_type: `i64`, 
      index_position: 1, 
      limit: 50
    } as ApiParams;
    return await this.getTable(params);
  }
}

export function getChainApi(){
  return new ChainApi('http://mainnet.telos.net', fetch);
}