import { HttpClient } from './HttpClient';

export class BlockProducerHttpClient extends HttpClient {
    public constructor(baseRoute: string) {
        super(baseRoute);
    }

    private getRawProducerData = ():any =>  this.instance.get('/bp.json');
    private getChainInfo = ():any => this.instance.get('/chains.json');

    public async getProducerInfo():Promise<any>{
        const rawData = await this.getRawProducerData();
        const chains = await this.getChainInfo();
        rawData.chains = chains;
        return rawData;
    }
}

export class BlockProducer {
    public name = ""
    public producerData: any;

    public constructor(producerData: any) {
        this.name = producerData.org.candidate_name;
        this.producerData = producerData;
    }
}