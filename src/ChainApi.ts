import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { ApiParams } from './types/ApiParams';

class ChainApi {

private rpc: any;

constructor(endpoint: string, fetch: any){
  this.rpc = new JsonRpc(endpoint, { fetch });
}

public async getTable(params: ApiParams): Promise<any[]> {
    const resultObj = await this.rpc.get_table_rows(params);
    return resultObj.rows;
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

  public filterByPropertyValue(array: Record<string, unknown>[],prop: string, value: number | string | boolean ): Record<string, unknown>[]{
    return array.filter((a)=> { return a[prop] === value})
  }
}

export function getChainApi(){
  return new ChainApi('http://mainnet.telos.net', fetch);
}