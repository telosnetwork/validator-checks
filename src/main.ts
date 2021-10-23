import "module-alias/register";
import { getProducerData } from "@services";
import { BlockProducer } from "@types";

const FETCH_COUNT = 10;


export async function getProducer(owner: string): Promise<BlockProducer[]>{
    const producer = await getProducerData(1, owner);
    return producer.data;
}

export async function getProducers(limit: number): Promise<BlockProducer[]>{
    const count = Math.floor( limit / FETCH_COUNT)
    const remainder = limit % FETCH_COUNT;
    const producerData = [] as BlockProducer[];

    let i = 1;
    let next = '';

    while(i < count + 1){
        const producerArray =  await getProducerData(10, next);
        producerData.concat(producerArray.data);
        next = producerArray.key;
        i++
    }
    if (remainder){
        const producerArray = await getProducerData(remainder, next);
        producerData.concat(producerArray.data);
    }
    return producerData;
}


(async () => {
    const producer = await getProducer('caleosblocks');
    console.dir(producer);

    const producers = await getProducers(6);
    console.dir(producers);


})()