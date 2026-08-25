import {Router} from 'express'; import {supabaseAdmin} from '../services/supabase.js'; import {requireAuth,requireRole} from '../middleware/auth.js';
const router=Router(); router.use(requireAuth,requireRole('admin'));
router.get('/bookings',async(req,res,next)=>{try{const {data,error}=await supabaseAdmin.from('bookings').select('*, class_schedules(*, classes(title))').order('created_at',{ascending:false});if(error)throw error;res.json(data);}catch(e){next(e);}});
router.patch('/bookings/:id',async(req,res,next)=>{try{const allowed=['pending','confirmed','cancelled','completed'];if(!allowed.includes(req.body.status))return res.status(400).json({error:'Invalid booking status'});const {data,error}=await supabaseAdmin.from('bookings').update({status:req.body.status}).eq('id',req.params.id).select().single();if(error)throw error;res.json(data);}catch(e){next(e);}});
export default router;
