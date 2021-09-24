import { getProducersInfo } from '@services';
import axios from 'axios';

jest.mock('axios');

describe('getProducerInfo', () => {
    
    const testUrlArray = ["https://test.com"]
    const bpPath = 'bp.json';
    const chainPath = 'chains.json';
    const mockReturnObj = { data: {org: { candidate_name: 'test-name'} }};

    it('hits bp.json endpoint', async () => {
        (axios as any).get.mockResolvedValueOnce(mockReturnObj);

        await getProducersInfo(testUrlArray);
        expect(axios.get).toHaveBeenCalledWith(`${testUrlArray[0]}/${bpPath}`);
    });

    it('hits chains.json endpoint', async () => {
        (axios as any).get.mockResolvedValueOnce(mockReturnObj);

        await getProducersInfo(testUrlArray);
        expect(axios.get).toHaveBeenCalledWith(`${testUrlArray[0]}/${chainPath}`);
    });

    it('throws error if bad data', async () => {
        const mockReturnObj = { data: 'test'};

        console.error = jest.fn();
        (axios as any).get.mockResolvedValueOnce(mockReturnObj);

        await getProducersInfo(testUrlArray);
        expect(console.error).toHaveBeenCalled();
    });
})