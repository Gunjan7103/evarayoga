import 'dotenv/config';

const required=['SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY'];

for(const key of required){
  if(!process.env[key]){
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const port=Number(process.env.PORT||4000);
if(!Number.isInteger(port)||port<1||port>65535){
  throw new Error('PORT must be a valid TCP port');
}

const corsOrigin=(process.env.CORS_ORIGIN||'').trim();
if(!corsOrigin){
  throw new Error('CORS_ORIGIN must be explicitly configured');
}

export const env={
  port,
  nodeEnv:process.env.NODE_ENV||'development',
  corsOrigin,
  supabaseUrl:process.env.SUPABASE_URL,
  supabaseAnonKey:process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey:process.env.SUPABASE_SERVICE_ROLE_KEY
};
