import {Router} from 'express';
import {supabaseAdmin} from '../services/supabase.js';

const router=Router();
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/schedules',async(req,res,next)=>{
  try{
    const {data,error}=await supabaseAdmin
      .from('class_schedules')
      .select('*, classes(id,title,duration_minutes,price)')
      .eq('status','open')
      .gt('starts_at',new Date().toISOString())
      .order('starts_at');

    if(error) throw error;
    res.json({data});
  }catch(error){next(error);}
});

router.post('/',async(req,res,next)=>{
  try{
    const {schedule_id,customer_name,email,phone,notes}=req.body||{};

    if(typeof schedule_id!=='string'||typeof customer_name!=='string'||typeof email!=='string'){
      return res.status(400).json({error:'schedule_id, customer_name and email are required'});
    }

    const name=customer_name.trim();
    const normalizedEmail=email.trim().toLowerCase();

    if(name.length<2||name.length>120){
      return res.status(400).json({error:'Please provide a valid customer name'});
    }

    if(!emailPattern.test(normalizedEmail)){
      return res.status(400).json({error:'Please provide a valid email address'});
    }

    const {data,error}=await supabaseAdmin.rpc('create_booking',{
      p_schedule_id:schedule_id,
      p_customer_name:name,
      p_email:normalizedEmail,
      p_phone:typeof phone==='string'?phone.trim()||null:null,
      p_notes:typeof notes==='string'?notes.trim()||null:null
    });

    if(error){
      if(/full|unavailable|duplicate/i.test(error.message)){
        return res.status(409).json({error:error.message});
      }
      throw error;
    }

    res.status(201).json({
      message:'Booking request received',
      data
    });
  }catch(error){next(error);}
});

export default router;
