import {Router} from 'express'; import {supabaseAdmin} from '../services/supabase.js';
const router=Router();
router.post('/',async(req,res,next)=>{try{const {name,email,phone,message}=req.body;if(!name||!email||!message)return res.status(400).json({error:'Name, email and message are required'});const {data,error}=await supabaseAdmin.from('contact_messages').insert({name,email,phone:phone||null,message}).select('id,created_at').single();if(error)throw error;res.status(201).json({message:'Message received',data});}catch(e){next(e);}});
export default router;
