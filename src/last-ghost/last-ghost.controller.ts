import { Controller, Get } from '@nestjs/common';
import axios from 'axios';
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);

@Controller('last_ghost')
export class LastGhostController {

  @Get()
  async getHello(): Promise<string> {
    const url = "http://ghost.bp.fo/ghost/"
    let uri = ""
    const { data } = await axios.get(url);
    uri = $(data).find("a:last").attr("href")
    return url + uri
  }

}
