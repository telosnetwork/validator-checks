import axios from 'axios';
import { ChainApi } from "@services";
import { BlockProducer, Chains, NetworkNode, ResultsTuple } from "@types";

const mainNetUrl = 'https://mainnet.telos.net';
const testNetUrl = 'https://testnet.telos.net';
const chainInfo = '/v1/chain/get_info';
const chainPath = '/chains.json';

let chainApi: ChainApi;
let chainId: string;
let mainNetJsonPath: string;
let testChainApi: ChainApi;
let testChainId: string;
let testNetJsonPath: string;

export async function getProducerData(limit=10, lower_bound = '',  mainNet = mainNetUrl, testNet = testNetUrl): Promise<ResultsTuple> {
    chainApi = new ChainApi(mainNet);
    chainId = (await chainApi.getInfo()).chain_id;
    testChainApi = new ChainApi(testNet);
    testChainId = (await testChainApi.getInfo()).chain_id;

    const producerData = await chainApi.getProducers(lower_bound, limit);
    const producers = producerData[0];
    const next_key = producerData[1];
    const producerInfoArray: BlockProducer[] = [];

    for (const producer of producers as BlockProducer[]){

        const chainData = await getData(producer.url, chainPath);

        if (chainData && typeof chainData !== 'string'){
          producer.chains = chainData.chains as Chains;
          mainNetJsonPath = producer.chains[chainId];
          testNetJsonPath = producer.chains[testChainId]; 
        }

        if (mainNetJsonPath){
            const jsonData = await getData(producer.url, mainNetJsonPath);

            if (jsonData && typeof jsonData !== 'string'){
                producer.org = jsonData.org;
                producer.nodes = jsonData.nodes as NetworkNode[];
                const queryNode = getQueryNode(producer.nodes);
                if (queryNode){          
                    producer.apiVerified = await verifyEndpoint(queryNode.api_endpoint as string);
                    producer.sslVerified = await verifyEndpoint(queryNode.ssl_endpoint as string);
                }
            }
        }

        if (testNetJsonPath){
            const jsonData = await getData(producer.url, testNetJsonPath);
            if (jsonData && typeof jsonData !== 'string'){
                const queryNode = getQueryNode(jsonData.nodes);
                if (queryNode){          
                  producer.apiVerifiedTestNet = await verifyEndpoint(queryNode.api_endpoint as string);
                  producer.sslVerifiedTestNet = await verifyEndpoint(queryNode.ssl_endpoint as string);
                }
            }
        }

        producerInfoArray.push(producer);
    }
    return [producerInfoArray, next_key];
}

async function getData(url: string, path: string): Promise<any>{
    try{
        const rawData = await axios.get(`${url}${path}`);
        return rawData.data;
    }catch (e){
        return null;
    }
}

function getQueryNode(nodes: NetworkNode[]): NetworkNode{
    return nodes.filter((node: NetworkNode) => node.node_type === 'query')[0];
}

async function verifyEndpoint(endpoint: string): Promise<boolean> {
    try {
        await axios.get(`${endpoint}${chainInfo}`);
        return true;
    }catch (e){
        return false;
    }
}