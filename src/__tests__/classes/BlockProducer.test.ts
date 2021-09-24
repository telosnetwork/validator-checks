import { BlockProducer } from '@classes';

describe('BlockProducer', () => {
    const testProducerInfo = {
        org: {
            candidate_name: 'test-name'
        },
        test: 'test'
    };

    const testInstance = new BlockProducer(testProducerInfo);

    it('sets producer name', () => {
        expect(testInstance.name).toBe(testProducerInfo.org.candidate_name)
    });

    it('sets data', () => {
        expect(testInstance.producerData).toBe(testProducerInfo)
    });
})