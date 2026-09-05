import {Router} from 'express';
import {supabaseAdmin} from '../services/supabase.js';

const router=Router();
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/',async(req,res,next)=>{
  try{
    const {name,email,phone,message}=req.body||{};

    if(typeof name!=='string'||typeof email!=='string'||typeof message!=='string'){
      return res.status(400).json({error:'Name, email and message are required'});
    }

    const cleanName=name.trim();
    const cleanEmail=email.trim().toLowerCase();
    const cleanMessage=message.trim();

    if(cleanName.length<2||cleanName.length>120){
      return res.status(400).json({error:'Please provide a valid name'});
    }

    if(!emailPattern.test(cleanEmail)){
      return res.status(400).json({error:'Please provide a valid email address'});
    }

    if(cleanMessage.length<5||cleanMessage.length>5000){
      return res.status(400).json({error:'Message must be between 5 and 5000 characters'});
    }

    const {data,error}=await supabaseAdmin
      .from('contact_messages')
      .insert({
        name:cleanName,
        email:cleanEmail,
        phone:typeof phone==='string'?phone.trim()||null:null,
        message:cleanMessage
      })
      .select('id,created_at')
      .single();

    if(error) throw error;

    res.status(201).json({message:'Message received',data});
  }catch(error){next(error);}
});

export default router;
