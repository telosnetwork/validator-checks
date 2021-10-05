export class BlockProducer {
    public producerData: any;

    public constructor(producerData: any) {
        this.producerData = producerData;
    }

    public isOnChain(chanId: string): boolean{
        return chanId in this.producerData.chains;
    }
}