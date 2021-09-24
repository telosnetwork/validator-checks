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
});