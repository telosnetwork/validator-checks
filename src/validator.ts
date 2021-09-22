import { BlockProducerHttpClient } from "./types/BlockProducerHttpClient";
import { BlockProducer } from "./types/BlockProducer";
import axios from 'axios';


//to use ininterceptors 
export async function getProducersArrayUsingClient(urlArray: string[]): Promise<BlockProducer[]>{
    const producerInfoArray: BlockProducer[] = [];
    for (const url of urlArray){
        const producerClient = new BlockProducerHttpClient(url);
        const producerData = await producerClient.getProducerInfo();
        const producer = new BlockProducer(producerData);
        producerInfoArray.push(producer);
    }
    return producerInfoArray;
}

const bpPath = '/bp.json';
const chainPath = 'chains.json';

export async function getProducersArray(urlArray: string[]): Promise<BlockProducer[]>{
    const producerInfoArray: BlockProducer[] = [];
    for (const url of urlArray){
        try{
            const rawData = await axios.get(`${url}${bpPath}`);
            rawData.data.chains = await axios.get(`${url}${chainPath}`);
            const producer = new BlockProducer(rawData.data);
            producerInfoArray.push(producer);
        }catch(error){
            console.error(error);
        }
    }
    return producerInfoArray;
}

(async () => {
    const producerUrlArray:string[] = ["https://goodblock.io/", "https://caleos.io"]
    const test = await getProducersArrayUsingClient(producerUrlArray);
    console.dir(test);
})()
