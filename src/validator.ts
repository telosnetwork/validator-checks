import { BlockProducer } from "./types/BlockProducer";

const testProducer = new BlockProducer("https://caleos.io");

(async () => {
    testProducer.producerInfo = await testProducer.getProducerInfo().catch((error:any) => console.error(error));
    return testProducer;
})().then( testProducer => {
    console.log(testProducer.producerInfo);
});



