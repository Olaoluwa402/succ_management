import  App  from './app';
import 'dotenv/config'
import validateEnv from './utils/validateEnv';
import TalentController from './resources/talent/talent.controller';
import CriticalRoleController from './resources/critical-roles/criticalRole.controller';


validateEnv()
const app = new App([new TalentController(),new CriticalRoleController()], Number(process.env.PORT));

app.listen();
