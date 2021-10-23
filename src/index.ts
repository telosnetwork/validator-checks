import { getProducerData } from "@services";
import { BlockProducer } from "@types";

const FETCH_COUNT = 10;

export async function getProducer(owner: string): Promise<BlockProducer[]>{
    const producer = await getProducerData(1, owner);
    return producer.data;
}

export async function getProducers(limit = 50): Promise<BlockProducer[]>{

    const count = Math.floor( limit / FETCH_COUNT)
    const remainder = limit % FETCH_COUNT;
    let producerData = [] as BlockProducer[];
    let i = 1;
    let next = '';

    while(i < count + 1){
        const producerArray =  await getProducerData(FETCH_COUNT, next);
        producerData = [ ...producerData, ...producerArray.data];
        next = producerArray.key;
        i++
    }
    if (remainder){
        const producerArray = await getProducerData(remainder, next);
        producerData = [ ...producerData, ...producerArray.data];
    }
    return producerData;
}