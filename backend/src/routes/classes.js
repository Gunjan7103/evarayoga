import {Router} from 'express'; import {supabasePublic} from '../services/supabase.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{const {data,error}=await supabasePublic.from('classes').select('*, instructors(id,name,image_url)').eq('active',true).order('created_at',{ascending:false});if(error)throw error;res.json(data);}catch(e){next(e);}});
router.get('/:id',async(req,res,next)=>{try{const {data,error}=await supabasePublic.from('classes').select('*, instructors(id,name,image_url)').eq('id',req.params.id).eq('active',true).single();if(error)return res.status(404).json({error:'Class not found'});res.json(data);}catch(e){next(e);}});
export default router;
