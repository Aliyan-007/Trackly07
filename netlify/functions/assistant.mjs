/** Netlify classic function handler. Works with Groq and OpenAI-compatible chat APIs. */
const json=(statusCode,body)=>({statusCode,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(body)});
export const handler=async(event)=>{
  if(event.httpMethod!=='POST')return json(405,{error:'Method not allowed.'});
  try{
    const url=process.env.AI_API_URL?.trim(),key=process.env.AI_API_KEY?.trim(),model=process.env.AI_MODEL?.trim()||'llama-3.3-70b-versatile';
    if(!url||!key)return json(503,{error:'AI is not configured. Add AI_API_URL, AI_API_KEY, and AI_MODEL in Netlify environment variables, then redeploy.'});
    const {messages=[],context={},mode='general'}=JSON.parse(event.body||'{}');
    const instruction=mode==='timetable'
      ? 'Reply ONLY with valid JSON in this exact format: {"message":"short explanation","changes":[{"title":"string","day":0,"start":"HH:MM","end":"HH:MM","kind":"study","color":"#54a580"}]}. day is 0 Sunday through 6 Saturday. Include only new sessions to add; never invent fixed classes.'
      : 'Reply in concise, plain text.';
    const system={role:'system',content:`You are Trackly’s calm academic planning assistant. Help students plan realistically, break down work, and protect rest. ${instruction} Current workspace context: ${JSON.stringify(context)}. Do not claim to have performed actions outside this conversation.`};
    const upstream=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[system,...messages],temperature:0.5})});
    const raw=await upstream.text();let result={};try{result=raw?JSON.parse(raw):{}}catch{console.error('AI provider returned non-JSON:',upstream.status,raw.slice(0,300));return json(502,{error:`AI provider returned an invalid response (${upstream.status}). Check AI_API_URL and AI_MODEL.`})}
    if(!upstream.ok){const detail=result?.error?.message||result?.error||`AI provider request failed (${upstream.status}).`;console.error('AI provider error:',detail);return json(502,{error:String(detail)})}
    const message=result?.choices?.[0]?.message?.content;
    if(!message)return json(502,{error:'The AI provider returned no message. Check that AI_MODEL is available in your Groq account.'});
    return json(200,{message});
  }catch(error){console.error('Trackly assistant function error:',error);return json(500,{error:error instanceof Error?error.message:'Unexpected AI function error.'})}
};
