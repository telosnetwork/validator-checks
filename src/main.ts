import "module-alias/register";
import { /* getProducersInfo ,*/ getChainApi } from "@services";
// import { ApiParams, ResultsTuple } from "@types";


(async () => {
    // get block producer info from bp.json & chains.json
    // const producerUrlArray:string[] = ["https://goodblock.io/", "https://caleos.io"]
    // const test = await getProducersInfo(producerUrlArray);
    // console.dir(test);

    // const params = {
    //     json: true, 
    //     code: 'eosio', 
    //     scope: 'eosio',
    //     table: 'producers', 
    //     key_type: `i64`, 
    //     index_position: 1, 
    //     lower_bound: '14651781093154739648',
    //     limit: 1
    //   } as ApiParams;
    
    const chainApi = getChainApi();

    // let results: ResultsTuple = [[], params.lower_bound];

    // while (params.lower_bound){
    //     params.lower_bound = results[1];
    //     results = await chainApi.getProducerInfo(params);
    //     console.log(results[0], results[1]);
    //     console.log("PAGE");
    // }
    // console.log("DONE");

    // const results = await chainApi.getProducerInfo(params,['url', 'https://www.alohaeos.com']);
    // console.dir(results);

    // const filteredByString = chainApi.filterByPropertyValue(producers, 'url', 'https://kainosbp.com');
    // console.dir(filteredByString);

    // const filteredByNumber = chainApi.filterByPropertyValue(producers, 'is_active', 1);
    // console.dir(filteredByNumber);

    const chainInfo = await chainApi.getInfo();
    console.dir(chainInfo);

})()