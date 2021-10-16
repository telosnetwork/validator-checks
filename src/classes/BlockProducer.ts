import axios from 'axios';
import { getData} from '@services';

const chainInfo = 'v1/chain/get_info';
const bpPath = 'bp.json';
const chainPath = 'chains.json';
export class BlockProducer {
    public producer_account_name: any;
    public org: any;
    public nodes: any;
    public chains: any
    public apiVerified: boolean;
    public sslVerified: boolean;
    public testNet: boolean;

    public constructor(producerData: any, chainData: any) {
        if (producerData){
            this.producer_account_name = producerData.producer_account_name;
            this.org = producerData.org;
            this.nodes = producerData.nodes;
        }
        if (chainData){
            this.chains = chainData.chains;
        }
        this.apiVerified = false;
        this.sslVerified = false;  
        this.testNet = false; 
    }

    private _getFullNode(): any{
        if(this.nodes){
            return this.nodes.filter((node: any) => node.node_type === 'query')[0];
        }
        return null;
    }

    private _isOnChain(chanId: string): boolean{
        return chanId in this.chains;
    }

    private async _verifyEndpoints(): Promise<void> {
        const fullNode = this._getFullNode();
        if (fullNode){
            try {
                await axios.get(`${fullNode.api_endpoint}/${chainInfo}`);
                this.apiVerified = true;
            }catch (e){
                this.apiVerified = false;
            }
            try {
                await axios.get(`${fullNode.ssl_endpoint}/${chainInfo}`);
                this.sslVerified = true;
            }catch (e){
                this.sslVerified = false;
            }
        }
    }

    public verifyTestNet(chainId: string): void {
        this.testNet = this._isOnChain(chainId)
    }

    static async build(url:string): Promise<BlockProducer | void>{
        const producerData = await getData(url, bpPath);
        if (!producerData){
            return;
        }
        const chainData = await getData(url, chainPath);
        const producer = new BlockProducer(producerData, chainData);
        await producer._verifyEndpoints();
        return producer;
    } 
}