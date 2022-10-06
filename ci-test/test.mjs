import { getProducers } from "../dist/server.js";

;(async () => {
   const producers = await getProducers();
   console.log(JSON.stringify(producers, null, 4));
})();