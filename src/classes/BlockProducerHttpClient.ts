import { HttpClient } from './HttpClient';

export class BlockProducerHttpClient extends HttpClient {
    public constructor(baseRoute: string) {
        super(baseRoute);
    }

    /* istanbul ignore next */
    public getRawProducerData = ():any =>  this.instance.get('/bp.json');

    /* istanbul ignore next */
    public getChainInfo = ():any => this.instance.get('/chains.json');

    public async getProducerInfo():Promise<any>{
        const rawData = await this.getRawProducerData();
        const chains = await this.getChainInfo();
        rawData.chains = chains;
        
        return rawData;
    }
}