const API_BASE=(window.EVARA_API_BASE||'/api').replace(/\/$/,'');
export async function api(path,options={}){
  const response=await fetch(API_BASE+path,{
    headers:{'Content-Type':'application/json',...(options.headers||{})},
    ...options
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(payload.error||'Request failed');
  return payload;
}
