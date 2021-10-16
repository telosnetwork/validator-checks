import { BlockProducer } from "@classes";
import { ChainApi } from "@services";
import axios from 'axios';

const mainNetUrl = 'http://mainnet.telos.net';
// const testNetUrl = 'http://testnet.telos.net'

export async function getData(url: string, path: string): Promise<any>{
    let rawData: any;
    try{
        rawData = await axios.get(`${url}/${path}`);
        // rawData = rawData.replace(/\r?\n|\r/g, " ");
        return rawData.data;
    }catch (e){
        return null;
    }
}

export async function getProducersData(mainNet = mainNetUrl /*, testNet = testNetUrl */): Promise<BlockProducer[]> {
    const chainApi = new ChainApi(mainNet);
    const producers = await chainApi.getProducers('', 30, ['is_active', 1] );
    const producerInfoArray: BlockProducer[] = [];

    for (const producer of producers[0] as any){
        const newProducer = await BlockProducer.build(producer.url);
        if (newProducer) producerInfoArray.push(newProducer);
    }
    return producerInfoArray;
}