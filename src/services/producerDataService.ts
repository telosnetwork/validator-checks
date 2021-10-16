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
    const producers = await chainApi.getProducers('', 20, ['is_active', 1] );
    console.dir(producers);
    const urlArray:string[] = [];

    for (const producer of producers[0] as any){
        urlArray.push(producer.url)
    }

    const producerInfoArray: BlockProducer[] = [];
    for (const url of urlArray){
        try{
            const producer = await BlockProducer.build(url);
            if (producer) producerInfoArray.push(producer);
        }catch(error){
            console.error(error);
        }
    }
    return producerInfoArray;
}