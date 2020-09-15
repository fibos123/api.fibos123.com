import axios from 'axios';
import * as _ from 'lodash';
import { BpStatus } from 'src/interfaces/BpStatus';
import config from './config';

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
  getLast()
  setInterval(getLog, 1000)
}

async function getBPs() {
  const { data } = await axios.post(config.rpc_get_table_rows, {
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

async function getBlock(block_num_or_id) {
  const { data } = await axios.post(config.rpc_get_block, { "block_num_or_id": block_num_or_id })
  setBPnumber(data.producer, data.block_num, data.timestamp)
  return data;
}

async function getLast() {
  const head_block_num = head.head_block_num;
  const head_block_producer = head.head_block_producer;
  for (let i = 1; i <= 20; i++) {
    getBlock(head_block_num - i * 12)
  }

  for (let i = 1; i <= 20; i++) {
    const data = await getBlock(head_block_num - i)
    if (data.head_block_producer != head_block_producer) {
      const number = data.block_num
      for (let i = 1; i <= 20; i++) {
        getBlock(number - i * 12)
      }
      continue;
    }
  }
}

function setBPnumber(bpname, number, date) {
  const index = list.findIndex(item => item.bpname === bpname)
  if (-1 === index) {
    list.push({ bpname, number, date })
  } else if (list[index].number < number) {
    list[index] = { bpname, number, date }
  }
}

async function getLog() {
  const { data } = await axios.get(config.rpc_get_info)
  head.head_block_producer = data.head_block_producer
  head.head_block_num = data.head_block_num
  head.head_block_time = data.head_block_time
  head.bp_status_refresh_time = new Date();
  setBPnumber(data.head_block_producer, data.head_block_num, data.head_block_time)
  list = _.orderBy(list, ["number"], ["desc"])
  list = list.slice(0, 21)
  list = _.orderBy(list, ["bpname"], ["asc"])
}

async function bpStatus(): Promise<BpStatus> {
  if (list.length === 0) {
    await init()
  }
  let rows: any[] = []
  list.forEach(item => {
    rows[item.bpname] = head.head_block_num - item.number > 504 ? 'offline' : 'online'
  })
  return {
    rows,
    rows2: list,
    ...head
  }
}

export default bpStatus