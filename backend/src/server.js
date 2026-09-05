import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {env} from './config/env.js';
import classes from './routes/classes.js';
import instructors from './routes/instructors.js';
import testimonials from './routes/testimonials.js';
import contact from './routes/contact.js';
import bookings from './routes/bookings.js';
import admin from './routes/admin.js';
import {errorHandler} from './middleware/errorHandler.js';

const app=express();

const allowedOrigins=env.corsOrigin
  .split(',')
  .map(origin=>origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin,callback){
    if(!origin||allowedOrigins.includes(origin)) return callback(null,true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods:['GET','POST','PATCH','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization']
}));
app.use(express.json({limit:'100kb'}));
app.use(morgan(env.nodeEnv==='production'?'combined':'dev'));

app.get('/api/health',(req,res)=>res.json({
  status:'ok',
  service:'evara-yoga-backend'
}));

app.use('/api/classes',classes);
app.use('/api/instructors',instructors);
app.use('/api/testimonials',testimonials);
app.use('/api/contact',contact);
app.use('/api/bookings',bookings);
app.use('/api/admin',admin);

app.use('/api',(req,res)=>res.status(404).json({error:'API endpoint not found'}));
app.use(errorHandler);

app.listen(env.port,()=>{
  console.log(`Evara Yoga API running on port ${env.port}`);
});
