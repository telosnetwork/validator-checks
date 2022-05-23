import fetch from 'node-fetch';
import { JsonRpc } from 'eosjs';
import { GetAccountResult, GetInfoResult, GetTableRowsResult, ProducerAuthority } from 'eosjs/dist/eosjs-rpc-interfaces';
import { ApiParams, Filter, Results, BlockProducer} from '../types';

export class ChainApi {

  public rpc: JsonRpc;

  /**
   * @param endpoint url string used for rpc instance
   */
  constructor(endpoint: string){
    this.rpc = new JsonRpc(endpoint, { fetch });
  }

  public async getInfo():Promise<GetInfoResult> {
    return await this.rpc.get_info();
  }

  /**
   * @param params general params object for generic table query
   */
  public async getTable(params: ApiParams): Promise<GetTableRowsResult> {
    const results = await this.rpc.get_table_rows(params);
    return results;
  }

  /**
   * @param params general params object for generic table query
   * @param filter is a tuple [table property, value to filter by] to optionally filter results
   */
  public async getTableInfo(params: ApiParams, filter?: Filter): Promise<Results> {
    let next_key = "";
    let producerArray = [];

    const results = await this.getTable(params); 
    if (results.more && results.next_key) next_key = results.next_key;

    producerArray = filter === undefined ? results.rows : this.filterByProperty(results.rows, filter);

    return { data: producerArray, key: next_key};
  }

  /**
   * @param array block producer object array to fileter by prop
   * @param filter optional tuple [table property, value to filter by] to filter results
   */
  public filterByProperty(array: BlockProducer[], filter: Filter): BlockProducer[]{
    return array.filter((producer: BlockProducer) => producer[filter.prop] === filter.value);
  }

  /**
   * @param lowerBound optional next bound to set if more results than set limit
   * @param limit optional results limit
   * @param filter optional tuple [table property, value to filter by] to filter results, must be passed with lowerBound and limit
   */
  public async getProducers(lowerBound: string, limit: number): Promise<Results> {
    let next_key = "";

    const results = await this.rpc.get_producers(true, lowerBound, limit);
    let producerArray = results.rows as BlockProducer[];

    if (results.more) next_key = results.more;

    producerArray = this.filterByProperty(producerArray, {prop: 'is_active', value: 1});

    return {data: producerArray as BlockProducer[], key: next_key};
  }

  /**
   * @param accountName twelve character account name to get account details
   */
  public async getAccount( accountName: string): Promise<GetAccountResult> {
    return await this.rpc.get_account(accountName);
  }

  public async getActiveProducerSchedule(): Promise<ProducerAuthority[]>{
    const schedule = await this.rpc.get_producer_schedule();
    return schedule && schedule.active ? schedule.active.producers : [] as ProducerAuthority[]
  }
}
