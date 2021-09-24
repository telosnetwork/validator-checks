import { BlockProducer, BlockProducerHttpClient } from "@classes";
import axios from 'axios';

const bpPath = 'bp.json';
const chainPath = 'chains.json';

//alternative for getProducersInfo() if use of interceptors is desired  
export async function getProducersInfoUsingClient(urlArray: string[]): Promise<BlockProducer[]>{
    const producerInfoArray: BlockProducer[] = [];
    for (const url of urlArray){
        const producerClient = new BlockProducerHttpClient(url);
        const producerData = await producerClient.getProducerInfo();
        const producer = new BlockProducer(producerData);
        producerInfoArray.push(producer);
    }
    return producerInfoArray;
}

async function getData(url: string): Promise<any>{
    const rawData = await axios.get(`${url}/${bpPath}`);
    rawData.data.chains = await axios.get(`${url}/${chainPath}`);
    return rawData.data;
} 

export async function getProducersInfo(urlArray: string[]): Promise<BlockProducer[]>{
    const producerInfoArray: BlockProducer[] = [];
    for (const url of urlArray){
        try{
            const data = await getData(url);
            const producer = new BlockProducer(data);
            producerInfoArray.push(producer);
        }catch(error){
            console.error(error);
        }
    }
    return producerInfoArray;
}