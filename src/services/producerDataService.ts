import { BlockProducer, ResultsTuple } from "@types";
import { ChainApi } from "@services";
import axios from 'axios';

const mainNetUrl = 'https://mainnet.telos.net';
const testNetUrl = 'https://testnet.telos.net';
const chainInfo = 'v1/chain/get_info';
const bpPath = 'bp.json';
const chainPath = 'chains.json';

let testNetJsonPath = '';
let chainApi: any;
let testChainApi: any;
let testChainId: string;

export async function getProducerData(limit=10, lower_bound = '',  mainNet = mainNetUrl, testNet = testNetUrl): Promise<ResultsTuple> {
    chainApi = new ChainApi(mainNet);
    testChainApi = new ChainApi(testNet);
    testChainId = (await testChainApi.getInfo()).chain_id;

    const producerData = await chainApi.getProducers(lower_bound, limit);
    const producers = producerData[0];
    const next_key = producerData[1];
    const producerInfoArray: BlockProducer[] = [];

    for (const producer of producers as any){

        const jsonData = await getData(producer.url, bpPath);

        if (jsonData && typeof jsonData !== 'string'){
          producer.org = jsonData.org;
          producer.nodes = jsonData.nodes;
          const queryNode = getQueryNode(producer.nodes);
          if (queryNode){          
            producer.apiVerified = await verifyEndpoint(queryNode.api_endpoint);
            producer.sslVerified = await verifyEndpoint(queryNode.ssl_endpoint);
          }
        }

        const chainData = await getData(producer.url, chainPath);

        if (chainData && typeof chainData !== 'string'){
          producer.chains = chainData.chains 
          testNetJsonPath = producer.chains[testChainId]; 
        }

        if (testNetJsonPath){
            const jsonData = await getData(producer.url, testNetJsonPath);
            if (jsonData && typeof jsonData !== 'string'){
                const queryNode = getQueryNode(jsonData.nodes);
                if (queryNode){          
                  producer.apiVerifiedTestNet = await verifyEndpoint(queryNode.api_endpoint);
                  producer.sslVerifiedTestNet = await verifyEndpoint(queryNode.ssl_endpoint);
                }
            }
        }

        producerInfoArray.push(producer);
    }
    return [producerInfoArray, next_key];
}

async function getData(url: string, path: string): Promise<any>{
    let rawData: any;
    try{
        rawData = await axios.get(`${url}/${path}`);
        return rawData.data;
    }catch (e){
        return null;
    }
}

function getQueryNode(nodes: any): any{
    return nodes.filter((node: any) => node.node_type === 'query')[0];
}

async function verifyEndpoint(endpoint: string): Promise<boolean> {
    try {
        await axios.get(`${endpoint}/${chainInfo}`);
        return true;
    }catch (e){
        return false;
    }
}

export async function getProducer(owner: string): Promise<any>{
    return await chainApi.getProducer(owner);
}