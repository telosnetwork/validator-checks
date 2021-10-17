import { NetworkNode, Chains } from "@types";
export interface BlockProducer {
    [key: string]: any;
    owner: string;
    total_votes: string;
    producer_key: string;
    is_active: 0 | 1;
    unreg_reason: string;
    url: string;
    unpaid_blocks: number;
    lifetime_produced_blocks: number;
    missed_blocks_per_rotation: number;
    lifetime_missed_blocks: number;
    last_claim_time: string;
    location: number;
    kick_reason_id: number;
    kick_reason: string;
    times_kicked: number;
    kick_penalty_hours: number;
    last_time_kicked: string;
    org?: any[];
    nodes?: NetworkNode[];
    chains?: Chains;
    apiVerified?: boolean;
    sslVerified?: boolean;
    apiVerifiedTestNet?: boolean;
    sslVerifiedTestNet?: boolean;
}