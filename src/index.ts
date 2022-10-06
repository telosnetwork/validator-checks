import { getProducerData } from "./services";
import { BlockProducer } from "types";


export async function getProducer(owner: string): Promise<BlockProducer> {
    return (await getProducerData(owner))[0];
}

export async function getProducers(): Promise<BlockProducer[]>{
    /*
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
     */

    return getProducerData();
}
