import { BlockProducerHttpClient } from "./types/BlockProducerHttpClient";
import { BlockProducer } from "./types/BlockProducer";
import { getChainApi } from "./ChainApi";
import axios from 'axios';

const bpPath = 'bp.json';
const chainPath = 'chains.json';

//to use interceptors 
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

async function getData(url: string): Promise<any>{
    const rawData = await axios.get(`${url}/${bpPath}`);
    rawData.data.chains = await axios.get(`${url}/${chainPath}`);
    return rawData.data;
} 

export async function getProducersArray(urlArray: string[]): Promise<BlockProducer[]>{
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




(async () => {
    // const producerUrlArray:string[] = ["https://goodblock.io/", "https://caleos.io"]
    // const test = await getProducersArray(producerUrlArray);
    // console.dir(test);

    const chainApi = getChainApi();
    
    const producers = await chainApi.getProducers();

    // const filteredByString = chainApi.filterByPropertyValue(producers, 'url', 'https://kainosbp.com');
    // console.dir(filteredByString);

    const filteredByNumber = chainApi.filterByPropertyValue(producers, 'is_active', 1);
    console.dir(filteredByNumber);

})()