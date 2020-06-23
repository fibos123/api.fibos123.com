const axios = require('axios');
const { url } = require('../config');
const { util } = require('../util');

let list = []
let head = {
  head_block_num: 0,
  head_block_time: "",
  head_block_producer: "",
  bp_status_refresh_time: new Date(),
  start_time: new Date()
}

async function init() {
  await getBPs()
  await getLog()
  await getLast()
  setInterval(getLog, 1000)
}

async function getBPs() {
  const { data } = await axios.post(url.rpc.get_table_rows, {
    "scope": "eosio",
    "code": "eosio",
    "table": "producers",
    "json": "true",
    "limit": 21,
    "key_type": "float64",
    "index_position": 2,
  })
  data.rows.forEach(item => {
    if (-1 === list.findIndex(item2 => item.owner === item2.owner)) {
      list.push({ bpname: item.owner, number: 0, date: 0 })
    }
  });
}

async function getLast() {
  for (let i = 1; i <= 20; i++) {
    const { data } = await axios.post(url.rpc.get_block, { "block_num_or_id": head.head_block_num - i * 12 })
    setBPnumber(data.producer, data.block_num, data.timestamp)
  }
}

function setBPnumber(bpname, number, date) {
  const index = list.findIndex(item => item.bpname === bpname)
  if (-1 === index) {
    list.push({ bpname, number, date })
  } else {
    list[index] = { bpname, number, date }
  }
}

async function getLog() {
  const { data } = await axios.get(url.rpc.get_info)
  head.head_block_producer = data.head_block_producer
  head.head_block_num = data.head_block_num
  head.head_block_time = data.head_block_time
  head.bp_status_refresh_time = new Date();
  setBPnumber(data.head_block_producer, data.head_block_num, data.head_block_time)
  list.sort(util.compare_sort("number"));
  list = list.slice(0, 21)
  list.sort(util.compare_sort("bpname"));
}

async function bpStatus() {
  if (list.length === 0) {
    await init()
  }
  let rows = {}
  list.forEach(item => {
    rows[item.bpname] = head.head_block_num - item.number > 504 ? 'offline' : 'online'
  })
  return {
    rows,
    rows2: list,
    ...head
  }
}

module.exports = bpStatus