import "module-alias/register";
// import fetch from 'node-fetch';
import {  getProducersData } from "@services";
// import { /* ApiParams, ResultsTuple,*/ FilterTuple } from "@types";

// export 
(async () => {
    

    // const producerArray = await getProducersData();
    await getProducersData();
    // console.dir(producerArray);

})()