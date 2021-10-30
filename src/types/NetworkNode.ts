interface Location {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export enum NodeType{
    Query = 'query',
    Full = 'full', //deprecated
    Producer = 'producer',
    Seed = 'seed'
}

enum FeatureOption {
    Chain = 'chain-api',
    Account = 'account-query',
    History = 'history-v1',
    Hyperion = 'hyperion-v2',
    Dfuse = 'dfuse',
    Fio = 'fio-api',
    Snapshot = 'snapshot-api',
    Dsp = 'dsp-api',
    Atomic = 'atomic-assets-api'
}

export interface NetworkNode {
    location: Location
    node_type: NodeType | NodeType[];
    api_endpoint?: string;
    ssl_endpoint?: string;
    features?: FeatureOption[]    
}

