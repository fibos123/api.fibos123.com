const rpc_endpoint = "https://api.fibos.rocks"; // thanks FIBOS ROCKS
const config = {
  rpc_endpoint,
  rpc_get_table_rows: rpc_endpoint + "/v1/chain/get_table_rows",
  rpc_get_info: rpc_endpoint + "/v1/chain/get_info",
  rpc_get_block: rpc_endpoint + "/v1/chain/get_block"
}

export default config;

