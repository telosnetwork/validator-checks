import { BlockProducer } from "@types";

export interface ResultsTuple {
    0: BlockProducer[];
    1: string // next_key passed as `lower_bound` param to retrieve results exceeding current limit 
}