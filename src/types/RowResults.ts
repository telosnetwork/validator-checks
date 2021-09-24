import { BlockProducerInfo } from "@types";

export interface RowResults {
    rows: BlockProducerInfo[],    
    more: boolean;
    next_key?: string;
}