import { getProducerData } from '@services';
import axios from 'axios';

jest.mock('axios');

describe('getProducerData', () => {
    
    const testUrlArray = "https://caleos.io"
    // const bpPath = '/bp.json';
    const chainPath = '/chains.json';
    // const mockReturnObj = { data: {org: { candidate_name: 'test-name'} }};

    it('hits bp.json endpoint', async () => {
        // (axios as any).get.mockResolvedValueOnce(mockReturnObj);

        await getProducerData(1, 'caleosblocks');
        expect(axios.get).toHaveBeenCalledWith(`${testUrlArray}${chainPath}`);
    });



    // it('hits chains.json endpoint', async () => {
    //     (axios as any).get.mockResolvedValueOnce(mockReturnObj);

    //     await getProducersInfo(testUrlArray);
    //     expect(axios.get).toHaveBeenCalledWith(`${testUrlArray[0]}/${chainPath}`);
    // });

    // it('throws error if bad data', async () => {
    //     const mockReturnObj = { data: 'test'};

    //     console.error = jest.fn();
    //     (axios as any).get.mockResolvedValueOnce(mockReturnObj);

    //     await getProducersInfo(testUrlArray);
    //     expect(console.error).toHaveBeenCalled();
    // });
})