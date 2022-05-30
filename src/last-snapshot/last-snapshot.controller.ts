import { Controller, Get } from '@nestjs/common';
import axios from 'axios';
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);

@Controller('last_snapshot')
export class LastSnapshotController {

  @Get()
  async getHello(): Promise<string> {
    const url = "https://fo.blockeden.cn:446/"
    let uri = ""
    const { data } = await axios.get(url);
    uri = $(data).find("a:last").attr("href")
    return url + uri
    //return "https://github.com/andy-backup/fibos/raw/master/snapshot.bin"
  }

}
