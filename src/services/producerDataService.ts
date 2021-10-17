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

/**
 * @param limit optional results limit
 * @param lowerBound optional key to set if more results than limit on previous call, use 'owner' property for single bp
 * @param mainNet optional value to set main net url, default is Telos main net
 * @param testNet optional value to set test net url, default is Telos test net
 */
export async function getProducerData(limit=1, lowerBound = '',  mainNet = mainNetUrl, testNet = testNetUrl): Promise<ResultsTuple> {
    
    chainApi = new ChainApi(mainNet);
    chainId = (await chainApi.getInfo()).chain_id;
    testChainApi = new ChainApi(testNet);
    testChainId = (await testChainApi.getInfo()).chain_id;

    const producerData = await chainApi.getProducers(lowerBound, limit);
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
        
        /* istanbul ignore else */
        if (mainNetJsonPath){
            const jsonData = await getData(producer.url, mainNetJsonPath);

            if (jsonData && typeof jsonData !== 'string'){
                producer.org = jsonData.org;
                producer.nodes = jsonData.nodes as NetworkNode[];
                const queryNode = getQueryNode(producer.nodes);
                /* istanbul ignore else */
                if (queryNode){          
                    producer.apiVerified = await verifyEndpoint(queryNode.api_endpoint as string);
                    producer.sslVerified = await verifyEndpoint(queryNode.ssl_endpoint as string);
                }
            }
        }

        /* istanbul ignore else */
        if (testNetJsonPath){
            const jsonData = await getData(producer.url, testNetJsonPath);
            if (jsonData && typeof jsonData !== 'string'){
                const queryNode = getQueryNode(jsonData.nodes);
                /* istanbul ignore else */
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

/**
 * @param url block producer website root url string with no trailing '/' 
 * @param path .json path with leading '/' 
 */
async function getData(url: string, path: string): Promise<any>{
    try{
        const rawData = await axios.get(`${url}${path}`);
        return rawData.data;
    }catch (e){
        return null;
    }
}

/**
 * @param nodes nodes array from rpc producer object
 */
function getQueryNode(nodes: NetworkNode[]): NetworkNode{
    return nodes.filter((node: NetworkNode) => node.node_type === 'query')[0];
}

/**
 * @param endpoint url string with no trailing '/' that calls chain info 
 */
export async function verifyEndpoint(endpoint: string): Promise<boolean> {
    try {
        await axios.get(`${endpoint}${chainInfo}`);
        return true;
    }catch (e){
        return false;
    }
}