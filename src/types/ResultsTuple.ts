import { BlockProducer } from "@types";

export interface ResultsTuple {
    data: BlockProducer[];
    key: string // next_key passed as `lower_bound` param to retrieve results exceeding current limit 
}