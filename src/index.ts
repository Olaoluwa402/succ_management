import App from "./app";
import { config } from "./config";
import TalentController from "./resources/talent/talent.controller";
import CriticalRoleController from "./resources/critical-roles/criticalRole.controller";

const app = new App(
  [new TalentController(), new CriticalRoleController()],
  Number(config.port)
);

app.listen();
