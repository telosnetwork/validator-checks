import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { ApiParams, FilterTuple, RowResults, ResultsTuple } from '@types';
import { ChainInfo } from 'types/ChainInfo';

export class ChainApi {

  public rpc: any;

  constructor(endpoint: string, fetch: any){
    this.rpc = new JsonRpc(endpoint, { fetch });
  }

  public async getTable(params: ApiParams): Promise<RowResults> {
    const results = await this.rpc.get_table_rows(params);
    return results;
  }

  public async getInfo():Promise<ChainInfo> {
    return await this.rpc.get_info();
  }

 /**
  * @param filter is a tuple [table property, value to filter by] to optionally filter results
  */
  public async getTableInfo(params: ApiParams, filter?: FilterTuple): Promise<ResultsTuple> {
    let next_key = "";
    let producerArray = [];

    const results = await this.getTable(params); 
    
    if (results.more && results.next_key) next_key = results.next_key;

    producerArray = filter === undefined ? results.rows : this.filterByPropertyValue(results.rows, filter);//results.rows.filter((a:any)=> { return a[filter[0]] === filter[1]});

    return [producerArray, next_key];
  }

  public filterByPropertyValue(array: any[], filter: FilterTuple): any[]{
    return array.filter((a: any)=> { return a[filter[0]] === filter[1]})
  }

 /**
  * @param lowerBound optional next bound to set if more results than set limit
  * @param limit optional results limit
  * @param filter optional tuple [table property, value to filter by] to filter results, must be passed with lowerBound and limit
  */
  public async getProducers(lowerBound = '', limit = 50, filter?: FilterTuple): Promise<ResultsTuple> {
    let next_key = "";
    let producerArray = [];

    const results = await this.rpc.get_producers(true, lowerBound, limit);

    if (results.more) next_key = results.more;

    producerArray = filter === undefined ? results.rows : this.filterByPropertyValue(results.rows, filter);

    return [producerArray, next_key];
  }

  public async getAccount( accountName: string): Promise<any>{
    return await this.rpc.get_account(accountName);
  }

  public async getProducerSchedule(): Promise<any>{
    const schedule = await this.rpc.get_producer_schedule();
    return schedule.active.producers;
  }
}


export function getChainApi(): ChainApi{
  return new ChainApi('http://mainnet.telos.net', fetch);
}