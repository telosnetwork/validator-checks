import {BlockProducerHttpClient} from '@classes';

describe('BlockProducer', () => {
    const testURL = 'https://caleos.io'
    const testProducer = new BlockProducerHttpClient(testURL);

    const props = Object.getOwnPropertyNames(testProducer);

    it('has getProducer prop (method)', () => {
        expect(props).toEqual(expect.arrayContaining(['getRawProducerData']));
    });

    it('has getChainInfo prop (method)', () => {
        expect(props).toEqual(expect.arrayContaining(['getChainInfo']));
    });

    it('appends chain info to raw producer data', async () => {
        const mockProducerData = { test: 'test-info'};
        const mockChainData = ['test-chain', 'test-chain-2'];

        testProducer.getRawProducerData = jest.fn().mockResolvedValue(mockProducerData);
        testProducer.getChainInfo = jest.fn().mockResolvedValue(mockChainData);

        const expected = { test: mockProducerData.test, chains: mockChainData };

        const result = await testProducer.getProducerInfo();

        expect(result).toEqual(expected);
    });
});