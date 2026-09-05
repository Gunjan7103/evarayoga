export function errorHandler(err,req,res,next){
  const status=Number.isInteger(err?.status)&&err.status>=400&&err.status<600
    ?err.status
    :500;

  console.error({
    method:req.method,
    path:req.originalUrl,
    status,
    message:err?.message
  });

  res.status(status).json({
    error:status===500?'Internal server error':(err?.message||'Request failed')
  });
}
