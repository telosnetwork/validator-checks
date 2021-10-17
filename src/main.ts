import "module-alias/register";
import { getProducerData, ChainApi } from "@services";

(async () => {

    const producerArray =  await getProducerData(1,'caleosblocks');
    console.dir(producerArray);

    const api = new ChainApi('https://mainnet.telos.net');
    const account = await api.getActiveProducerSchedule();
    console.log(account);

})()