import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `
<html>
<a href="/bp_status">/bp_status</a><br>
<a href="/last_snapshot">/last_snapshot</a><br>
<center><img src="https://pbs.twimg.com/media/DbxJHDDV0AI8bOt?format=jpg&name=4096x4096" width="400" /><br/>Lillie (Pokémon)</center>
</html>`;
  }
}
