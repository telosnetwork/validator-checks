import { HttpClient } from './http-client';

class BlockProducer extends HttpClient {
    public producerInfo: any;
    public chainInfo: any;

    public constructor(baseRoute: string) {
        super(baseRoute);
    }

    public getProducerInfo = () => this.instance.get('/bp.json');
    public getChainInfo = () => this.instance.get('/chains.json');
}

const testProducer = new BlockProducer("https://caleos.io");

(async () => {
    testProducer.producerInfo = await testProducer.getProducerInfo().catch(error => console.error(error));
    return testProducer;
})().then( testProducer => {
    console.log(testProducer.producerInfo);
})



