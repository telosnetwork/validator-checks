import "module-alias/register";
import { getProducerData } from "@services";

(async () => {

    const producerArray =  await getProducerData(1, 'caleosblocks');
    console.log(producerArray);

})()