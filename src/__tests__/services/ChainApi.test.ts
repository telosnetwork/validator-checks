import { GetAccountResult } from 'eosjs/dist/eosjs-rpc-interfaces';
import { ChainApi } from '@services';
import { ApiParams, Filter, BlockProducer } from '@types';

describe('ChainApi', () => {

    let chainApi: ChainApi;

    const testUrl = 'https://mainnet.telos.net'
    const mockValue = {
        rows: [{ owner: 'test-owner'}],
        more: 'test-key'
    } as any

    beforeEach(() => {
        chainApi = new ChainApi(testUrl);
    })

    describe('getInfo', () => {
        it('calls rpc get_info', async () => {
            chainApi.rpc.get_info = jest.fn();
            
            await chainApi.getInfo();
            
            expect(chainApi.rpc.get_info).toHaveBeenCalled();
        });
    });

    describe('getTable', () => {
        it('calls rpc get_table_rows', async () => {
            chainApi.rpc.get_table_rows = jest.fn();
            
            await chainApi.getTable({} as ApiParams);
            
            expect(chainApi.rpc.get_table_rows).toHaveBeenCalled();
        });
    });

    describe('getTableInfo', () => {
        const mockValue = {
            rows: [{ owner: 'test-owner'}, {owner: 'fake-owner'}] as BlockProducer[],
            more: false
        } as any

        it('calls getTable', async () => {
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue);
            
            await chainApi.getTableInfo({} as ApiParams);
            
            expect(chainApi.getTable).toHaveBeenCalled();
        });

        it('returns empty string if no remaining results', async () => {
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue);
            
            const results = await chainApi.getTableInfo({} as ApiParams);
            
            expect(results.key).toEqual('');
        });

        it('returns empty string if next_key is undefined', async () => {
            mockValue.more = true;
            mockValue.next_key = undefined;
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue);
            
            const results = await chainApi.getTableInfo({} as ApiParams);
            
            expect(results.key).toEqual('');
        });

        it('returns next_key if defined', async () => {
            mockValue.more = true;
            mockValue.next_key = 'test-key';
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue);
            
            const results = await chainApi.getTableInfo({} as ApiParams);
            
            expect(results.key).toEqual(mockValue.next_key);
        });

        it('calls filterByProperty if filter param', async () => {
            const mockFilter = { prop: 'owner', value: 'test-owner'} as Filter;
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue);
            chainApi.filterByProperty = jest.fn();
            
            await chainApi.getTableInfo({} as ApiParams, mockFilter);

            expect(chainApi.filterByProperty).toHaveBeenCalledWith(mockValue.rows, mockFilter);
        });
    });

    describe('filterByProperty', () => {
        it('returns filtered results', () => {
            const mockFilter = { prop: 'owner', value: 'test-owner'} as Filter;
            const mockArray = [{ owner: 'test-owner'} as BlockProducer, {owner: 'filtered-out'} as BlockProducer] as BlockProducer[];
            
            const results = chainApi.filterByProperty(mockArray, mockFilter);

            expect(results).toStrictEqual([mockArray[0]]);
        });
    });

    describe('getProducers', () => {

        const mockLimit = 1;
        const mockLowerBound = '';

        it('calls get_producers', async () => {
            chainApi.rpc.get_producers = jest.fn().mockResolvedValue(mockValue)
          
            await chainApi.getProducers(mockLowerBound, mockLimit);

            expect(chainApi.rpc.get_producers).toHaveBeenCalledWith(true, mockLowerBound, mockLimit);
        });

        it('returns next_key for pagination', async () => {
            const expected = { data: mockValue.rows, key: mockValue.more};
            chainApi.rpc.get_producers = jest.fn().mockResolvedValue(mockValue)

            const result = await chainApi.getProducers(mockLowerBound, mockLimit);

            expect(result).toEqual(expected);
        });

        it('returns empty string if `more` is false (all results returned)', async () => {
            const expected = { data: mockValue.rows, key: ''};
            mockValue.more = false;
            chainApi.rpc.get_producers = jest.fn().mockResolvedValue(mockValue)

            const result = await chainApi.getProducers(mockLowerBound, mockLimit);

            expect(result).toEqual(expected);
        });

        it('calls filterByProperty if optional filter param provided', async () => {
            const mockFilter = { prop: 'owner', value: 'filtered'} as Filter;
            mockValue.rows = [{ owner: 'test-owner'} as BlockProducer, {owner: 'filtered'} as BlockProducer];
            chainApi.filterByProperty = jest.fn();

            await chainApi.getProducers(mockLowerBound, mockLimit, mockFilter);

            expect(chainApi.filterByProperty).toHaveBeenCalled();
        });
    });

    describe('getAccount', () => {
        it('calls get_account', async () => {
            const mockName = 'test_account';
            const mockAccount = { account_name: mockName} as GetAccountResult;
            chainApi.rpc.get_account = jest.fn().mockResolvedValue(mockAccount);
            
            await chainApi.getAccount(mockName)
            
            expect(chainApi.rpc.get_account).toHaveBeenCalledWith(mockName);
        });
    });

    describe('getActiveProducerSchedule', () => {
        const mockPendingResult = {};
        const mockActiveResult = { 
            active: {
                producers: [{producer_name: 'test'}]
             }
        } 
        it('calls get_producer_schedule', async () => {
            chainApi.rpc.get_producer_schedule = jest.fn().mockResolvedValue(mockActiveResult);
           
            await chainApi.getActiveProducerSchedule();
           
            expect(chainApi.rpc.get_producer_schedule).toHaveBeenCalled();
        });

        it('returns active producers', async () => {
            chainApi.rpc.get_producer_schedule = jest.fn().mockResolvedValue(mockActiveResult);
           
            const results = await chainApi.getActiveProducerSchedule();
           
            expect(results).toEqual(mockActiveResult.active.producers);
        });

        it('returns empty array if no active', async () => {
            chainApi.rpc.get_producer_schedule = jest.fn().mockResolvedValue(mockPendingResult);
           
            const results = await chainApi.getActiveProducerSchedule();
           
            expect(results).toEqual([]);
        });
    });
});