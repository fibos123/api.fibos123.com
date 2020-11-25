import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return `
<a href="/bp_status">/bp_status</a><br>
<a href="/last_ghost">/last_ghost</a><br>
<a href="/last_snapshot">/last_snapshot</a><br>
<center><img src="https://i.pinimg.com/originals/40/f4/82/40f4820842b40cca27a935d7906af3c9.jpg" width="400" /><br/>Gakki</center>
`
  }

}
