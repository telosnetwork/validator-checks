import { HttpClient } from './HttpClient';

export class BlockProducer extends HttpClient {
    public producerInfo: any;
    public chainInfo: any;

    public constructor(baseRoute: string) {
        super(baseRoute);
    }

    public getProducerInfo = ():any => this.instance.get('/bp.json');
    public getChainInfo = ():any => this.instance.get('/chains.json');
}