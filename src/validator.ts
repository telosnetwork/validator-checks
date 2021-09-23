import { BlockProducerHttpClient } from "./types/BlockProducerHttpClient";
import { BlockProducer } from "./types/BlockProducer";
import { ChainApi } from "./ChainApi";
import axios from 'axios';
import {  JsonRpc } from 'eosjs';
import * as fetch from 'node-fetch';

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

const bpPath = 'bp.json';
const chainPath = 'chains.json';

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

export async function getChainData(endpoint: string): Promise<any>{
    const chainApi = new ChainApi(endpoint);
    return await chainApi.getTable();
}

export function test():any{
    const test = new JsonRpc('http://telos.caleos.io', { fetch } );
    return test;
}




(async () => {
    // const producerUrlArray:string[] = ["https://goodblock.io/", "https://caleos.io"]
    // const test = await getProducersArray(producerUrlArray);
    // console.dir(test);
    // await getChainData('http://telos.caleos.io');
    const testing = test();
    console.dir(testing);

})()