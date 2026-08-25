import {Router} from 'express'; import {supabasePublic} from '../services/supabase.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{const {data,error}=await supabasePublic.from('instructors').select('id,name,bio,experience,skills,image_url').eq('active',true).order('created_at',{ascending:false});if(error)throw error;res.json(data);}catch(e){next(e);}});
export default router;
