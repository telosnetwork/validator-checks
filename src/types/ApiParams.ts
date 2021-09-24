export interface ApiParams {
    json: boolean; // Get the response as json
    code: string; // Contract that we target
    scope: string; // Account that owns the data
    table: string; // Table name
    key_type: string; // Type of key
    index_position: number; // Position of index
    lower_bound: string; // Table secondary key value
    upper_bound: string;
    limit: number; //  # of rows to limit query
    reverse: boolean; // Optional: Get reversed data
    show_payer: boolean; // Optional: Show ram payer
}