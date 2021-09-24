import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { ApiParams, FilterTuple, RowResults, ResultsTuple } from '@types';

class ChainApi {

  private rpc: any;

  constructor(endpoint: string, fetch: any){
    this.rpc = new JsonRpc(endpoint, { fetch });
  }

  public async getTable(params: ApiParams): Promise<RowResults> {
    const results = await this.rpc.get_table_rows(params);
    return results;
  }

 /**
  * @param filter is a tuple [table property, value to filter by] to optionally filter results
  */
  public async getProducerInfo(params: ApiParams, filter?: FilterTuple): Promise<ResultsTuple> {
    let next_key = "";
    let producerArray = [];

    const results = await this.getTable(params); 

    if (results.more && results.next_key) next_key = results.next_key;
    producerArray = filter === undefined ? results.rows : results.rows.filter((a:any)=> { return a[filter[0]] === filter[1]});
    
    return [producerArray, next_key];
  }

  public filterByPropertyValue(array: Record<string, unknown>[],prop: string, value: number | string | boolean ): Record<string, unknown>[]{
    return array.filter((a)=> { return a[prop] === value})
  }
}

export function getChainApi(): ChainApi{
  return new ChainApi('http://mainnet.telos.net', fetch);
}