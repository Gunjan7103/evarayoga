import {Router} from 'express'; import {supabasePublic} from '../services/supabase.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{const {data,error}=await supabasePublic.from('testimonials').select('id,customer_name,content,rating,image_url').eq('published',true).order('created_at',{ascending:false});if(error)throw error;res.json(data);}catch(e){next(e);}});
export default router;
