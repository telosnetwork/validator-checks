import { BlockProducer, BlockProducerHttpClient } from "./types/BlockProducerHttpClient";

export async function getProducersArray(urlArray: string[]): Promise<BlockProducer[]>{
    const producerInfoArray: BlockProducer[] = [];
    for (const url of urlArray){
        const producerClient = new BlockProducerHttpClient(url);
        const producerData = await producerClient.getProducerInfo();
        const producer = new BlockProducer(producerData);
        producerInfoArray.push(producer);
    }
    return producerInfoArray;
}


(async () => {
    const producerUrlArray:string[] = ["https://goodblock.io/", "https://caleos.io"];
    const test = await getProducersArray(producerUrlArray);
    console.dir(test);
})()
