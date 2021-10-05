export class BlockProducer {
    public producerData: any;
    public fullNode: any;

    public constructor(producerData: any) {
        this.producerData = producerData;
        this.fullNode = this._getFullNode();
    }

    private _getFullNode(): any{
        return this.producerData.nodes.filter((node: any) => node.node_type === 'full')[0];
    }

    public isOnChain(chanId: string): boolean{
        return chanId in this.producerData.chains;
    }
    
}