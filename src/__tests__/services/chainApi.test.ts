import { getChainApi } from '@services';
import { ApiParams, RowResults, BlockProducerInfo, FilterTuple } from '@types';

describe('ChainApi', () => {
    const chainApi = getChainApi();

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

    describe('getProducerInfo', () => {

        const mockParams = {
            json: true, 
            code: 'eosio', 
            scope: 'eosio',
            table: 'producers', 
            key_type: `i64`, 
            index_position: 1, 
            lower_bound: '14651781093154739648',
            limit: 1
        } as ApiParams;

        const mockValue = {
            rows: [{ owner: 'test-owner'}],
            more: true,
            next_key: 'test-key'
        } as RowResults

        it('calls getTable', async() => {
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue)
            await chainApi.getProducerInfo({} as ApiParams);
            expect(chainApi.getTable).toHaveBeenCalled();
        });

        it('returns next_key for pagination', async () => {
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue)

            const result = await chainApi.getProducerInfo(mockParams);
            const expected = [ mockValue.rows, mockValue.next_key];

            expect(result).toEqual(expected);
        });

        it('returns empty string if `more` is false (all results returned)', async () => {
            const expected = [ mockValue.rows, ''];

            mockValue.more = false;
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue)

            const result = await chainApi.getProducerInfo(mockParams);

            expect(result).toEqual(expected);
        });

        it('returns filtered results if optional filter param provided', async () => {
            const testFilter = ['owner', 'test-owner'] as FilterTuple;

            mockValue.rows = [{ owner: 'test-owner'}, {owner: 'filtered-out'}] as BlockProducerInfo[];
            chainApi.getTable = jest.fn().mockResolvedValue(mockValue)

            const result = await chainApi.getProducerInfo(mockParams, testFilter);

            expect(result[0]).toEqual([mockValue.rows[0]]);
        });
    });

    describe('filterByPropertyValue', () => {

        const mockValue = {
            rows: [{ owner: 'test-owner'}, {owner: 'filtered-out'}],
            more: true,
            next_key: 'test-key'
        } as RowResults

        it('returns filtered results',  () => {
            const result = chainApi.filterByPropertyValue(mockValue.rows, 'owner', 'test-owner');

            expect(result).toEqual([mockValue.rows[0]]);
        });
    });
});