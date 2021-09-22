import { BlockProducer } from '../types/BlockProducer';

describe('BlockProducer', () => {
    const testURL = 'https://caleos.io'
    const testProducer = new BlockProducer(testURL);
    testProducer.producerInfo = "test-info";
    testProducer.chainInfo = "test-chain";
    const props = Object.getOwnPropertyNames(testProducer);

    it('has producerInfo field', () => {
        expect(props).toEqual(expect.arrayContaining(['producerInfo']));
    });

    it('has chainInfo field', () => {
        expect(props).toEqual(expect.arrayContaining(['chainInfo']));
    });

    it('has getProducer prop (method)', () => {
        expect(props).toEqual(expect.arrayContaining(['getProducerInfo']));
    });

    it('has getChainInfo prop (method)', () => {
        expect(props).toEqual(expect.arrayContaining(['getChainInfo']));
    });
});