/** Optional Resend welcome email. Set RESEND_API_KEY and RESEND_FROM in Netlify. */
export default async (req) => {
 if(req.method!=='POST')return new Response('Method not allowed',{status:405});
 const key=process.env.RESEND_API_KEY,from=process.env.RESEND_FROM;
 if(!key||!from)return Response.json({skipped:true});
 const {email,name}=await req.json();
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[email],subject:'Welcome to Trackly',html:`<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h1>Welcome to Trackly, ${name||'there'}.</h1><p>Your calmer academic workspace is ready. Plan one small thing, then begin.</p></div>`})});
 if(!response.ok)return Response.json({error:'Could not send welcome email.'},{status:500});return Response.json({sent:true});
};
