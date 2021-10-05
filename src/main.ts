import "module-alias/register";
import { /* getProducersInfo, */ getChainApi } from "@services";
// import { ApiParams, ResultsTuple, FilterTuple } from "@types";


(async () => {
    // get block producer info from bp.json & chains.json
    // const producerUrlArray:string[] = [ "https://caleos.io", 'https://telos.boid.com']
    // const test = await getProducersInfo(producerUrlArray);
    // console.dir(test[0].producerData);

    // const params = {
    //     json: true, 
    //     code: 'eosio', 
    //     scope: 'eosio',
    //     table: 'producers', 
    //     key_type: `i64`, 
    //     index_position: 1,
    //     limit: 100
    //   } as ApiParams;

    // const filter: FilterTuple = ['is_active', 1];
    
    const chainApi = getChainApi();

    // let results: ResultsTuple = [[], params.lower_bound];

    // while (params.lower_bound){
    //     params.lower_bound = results[1];
    //     results = await chainApi.getProducerInfo(params);
    //     console.log(results[0], results[1]);
    //     console.log("PAGE");
    // }
    // console.log("DONE");

    // const results = await chainApi.getTableInfo(params);
    // console.dir(results);

    // const producers = await chainApi.getProducers('', 50, filter);
    const producers = await chainApi.getProducers();
    console.dir(producers);

    // const prodSched: any = await chainApi.getProducerSchedule();
    // console.dir(prodSched[0].authority[1]);

    // const chainInfo = await chainApi.getInfo();
    // console.dir(chainInfo);
    // console.log(test[0].isOnChain(chainInfo.chain_id))

})()