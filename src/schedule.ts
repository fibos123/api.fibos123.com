import BpStatusService from "./lib/BpStatusService";

async function schedule(controller: ScheduledController, env: any, ctx: ExecutionContext) {
  console.log("cron processed", controller.cron);
  switch (controller.cron) {
    case "*/2 * * * *":
      const bpStatusService = new BpStatusService({ env } as any);
      await bpStatusService.getBPs();
      console.log("getBPs");
      break;
  }
}

export default schedule;