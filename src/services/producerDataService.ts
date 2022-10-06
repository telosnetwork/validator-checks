import axios from 'axios';
import { ChainApi } from "./ChainApi";
import { BlockProducer, Chains, NetworkNode, NodeType } from "types";

const TIMEOUT = 4000;
const shouldDebug = false;

const mainNetUrl = 'https://mainnet.telos.net';
const testNetUrl = 'https://testnet.telos.net';
const chainInfo = '/v1/chain/get_info';
const chainPath = '/chains.json';

let chainApi: ChainApi;
let chainId: string;
let testChainApi: ChainApi;
let testChainId: string;

function debug(message: string) {
   if (shouldDebug) {
       console.log(message);
   }
}

/**
 * @param limit optional results limit
 * @param lowerBound optional key to set if more results than limit on previous call, use 'owner' property for single bp
 * @param mainNet optional value to set main net url, default is Telos main net
 * @param testNet optional value to set test net url, default is Telos test net
 */
export async function getProducerData(producer?: string): Promise<BlockProducer[]> {
    chainApi = new ChainApi(mainNetUrl);
    chainId = (await chainApi.getInfo()).chain_id;
    testChainApi = new ChainApi(testNetUrl);
    testChainId = (await testChainApi.getInfo()).chain_id;

    const producers = producer ? [await chainApi.getProducer(producer)] : await chainApi.getAllProducers();
    producers.forEach(producer => producer.validationErrors = []);

    const producerPromises: Promise<BlockProducer>[] = [];
    for (const producer of producers as BlockProducer[]){
        producerPromises.push(doProducer(producer));
    }

    return await Promise.all(producerPromises);
}

async function doProducer(producer: BlockProducer): Promise<BlockProducer> {
    let mainNetJsonPath;
    let testNetJsonPath;
    debug(`Checking chainData for ${producer.owner}`)
    const chainsJsonResult = await getData(producer.url, chainPath);
    debug(`Got chainData for ${producer.owner}`)
    if (!chainsJsonResult.success) {
        debug(`${producer.owner} does not have a chains.json, falling back to url/bp.json for mainnet and skipping testnet`);
        producer.validationErrors.push('Missing chains.json');
        mainNetJsonPath = `${producer.url.replace(/\/$/, '')}/bp.json`;
    } else if (typeof chainsJsonResult.data !== 'string'){
        debug(`${producer.owner} does have a chains.json`);
        producer.chains = chainsJsonResult.data.chains as Chains;
        if (!producer.chains[chainId]) {
            debug(`${producer.owner} does have mainnet in chains.json`);
            producer.validationErrors.push('Missing mainnet from chains.json');
        } else {
            mainNetJsonPath = producer.chains[chainId];
        }

        if (!producer.chains[testChainId]) {
            debug(`${producer.owner} does have testnet in chains.json`);
            producer.validationErrors.push('Missing testnet from chains.json');
        } else {
            testNetJsonPath = producer.chains[testChainId];
        }
    }

    /* istanbul ignore else */
    if (mainNetJsonPath){
        debug(`Getting data for ${producer.owner} mainnet`);
        const bpJsonResult = await getData(producer.url, mainNetJsonPath);
        debug(`Got data for ${producer.owner} mainnet`);
        const jsonData = bpJsonResult.data;
        if (!bpJsonResult.success) {
            producer.validationErrors.push(`Error from fetching bp.json (${mainNetJsonPath}): ${bpJsonResult.error}`)
            return producer;
        }

        if (typeof jsonData !== 'string'){
            let queryNode;
            producer.org = jsonData.org;
            producer.nodes = jsonData.nodes as NetworkNode[];
            if (producer.nodes) {
                queryNode = getQueryNode(producer.nodes);
            }
            /* istanbul ignore else */
            if (queryNode) {
                const apiResult = await verifyEndpoint(queryNode.api_endpoint as string);
                if (!apiResult.success) {
                    producer.validationErrors.push(`Failure verifying api endpoint: ${apiResult.error}`)
                } else {
                    producer.apiVerified = true;
                }

                const sslResult = await verifyEndpoint(queryNode.ssl_endpoint as string);
                if (!sslResult.success) {
                    producer.validationErrors.push(`Failure verifying SSL endpoint: ${apiResult.error}`)
                } else {
                    producer.sslVerified = true;
                }
            }
        } else {
            producer.validationErrors.push(`bp.json data from ${mainNetJsonPath} was not proper json`)
        }
    }

    /* istanbul ignore else */
    if (testNetJsonPath){
        debug(`Getting data for ${producer.owner} testnet`);
        const bpJsonResult = await getData(producer.url, testNetJsonPath);
        const jsonData = bpJsonResult.data;
        if (!bpJsonResult.success) {
            producer.validationErrors.push(`Error from fetching bp.json (${testNetJsonPath}): ${bpJsonResult.error}`)
            return producer;
        }

        debug(`Got data for ${producer.owner} testnet`);
        if (typeof jsonData !== 'string'){
            let queryNode;
            if(jsonData.nodes){
                queryNode = getQueryNode(jsonData.nodes);
            }
            /* istanbul ignore else */
            if (queryNode) {
                const apiResult = await verifyEndpoint(queryNode.api_endpoint as string);
                if (!apiResult.success) {
                    producer.validationErrors.push(`Failure verifying testnet api endpoint: ${apiResult.error}`)
                } else {
                    producer.apiVerifiedTestNet = true;
                }

                const sslResult = await verifyEndpoint(queryNode.ssl_endpoint as string);
                if (!sslResult.success) {
                    producer.validationErrors.push(`Failure verifying testnet SSL endpoint: ${apiResult.error}`)
                } else {
                    producer.sslVerifiedTestNet = true;
                }
            }
        } else {
            producer.validationErrors.push(`bp.json data from ${testNetJsonPath} was not proper json`)
        }
    }

    return producer;
}

/**
 * @param url block producer website root url string with no trailing '/' 
 * @param path .json path with leading '/' 
 */
async function getData(url: string, path: string): Promise<any>{
    if (!url.endsWith('/'))
        url = `${url}/`;

    try{
        const rawData = await axios.get(`${url}${path}`, {timeout: TIMEOUT});
        return { success: true, data: rawData.data };
    } catch (e) {
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }

        return { success: false, error: e };
    }
}

/**
 * @param nodes nodes array from rpc producer object
 */
function getQueryNode(nodes: NetworkNode[]): NetworkNode{
    return nodes.filter((node: NetworkNode) => (
        node.node_type.includes(NodeType.Query) ||
        node.node_type.includes(NodeType.Full)
        )
    )[0];
}

/**
 * @param endpoint url string with no trailing '/' that calls chain info 
 */
export async function verifyEndpoint(endpoint: string): Promise<any> {
    try {
        await axios.get(`${endpoint}${chainInfo}`, {timeout: TIMEOUT});
        return { success: true };
    } catch (e) {
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }

        return { success: false, error: e };
    }
}