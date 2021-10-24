import axios from 'axios';
import { getProducerData, verifyEndpoint } from 'services';

describe('getProducerData', () => {
    
    const testUrlArray = "https://caleos.io"
    const bpPath = '/bp.json';
    const testNetJsonPath = '/testnet-bp.json';
    const chainPath = '/chains.json';

    it('uses default values if no params passed', async () => {
        const producerData = await getProducerData();

        expect(producerData).toBeInstanceOf(Object);
        expect(producerData.data).toBeInstanceOf(Array);
        expect(typeof producerData.key).toBe('string');
    });

    it('hits chains.json endpoint', async () => {
        const methodSpy = jest.spyOn(axios, 'get');

        await getProducerData(1, 'caleosblocks');

        expect(methodSpy).toHaveBeenCalledWith(`${testUrlArray}${chainPath}`);
    });

    it('hits bp.json endpoint', async () => {
        const methodSpy = jest.spyOn(axios, 'get');

        await getProducerData(1, 'caleosblocks');

        expect(methodSpy).toHaveBeenCalledWith(`${testUrlArray}${bpPath}`);
    });

    it('hits testnet bp.json endpoint', async () => {
        const methodSpy = jest.spyOn(axios, 'get');

        await getProducerData(1, 'caleosblocks');

        expect(methodSpy).toHaveBeenCalledWith(`${testUrlArray}${testNetJsonPath}`);
    });

    it('returns array length of limit', async () => {
        const limit = 2;

        const result = await getProducerData(limit);

        expect(result.data.length).toStrictEqual(limit);
    }, 10000);
});

describe('verifyEndpoint', () => {
    it('returns false if endpoint ping fails', async () =>{
        const testEndpoint = 'https://telos.net';

        const verified = await verifyEndpoint(testEndpoint);

        expect(verified).toStrictEqual(false);
    });
});