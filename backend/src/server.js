import {app} from './app.js';
import {env} from './config/env.js';

app.listen(env.port,()=>console.log(`Evara Yoga API running on port ${env.port}`));
