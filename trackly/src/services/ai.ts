/** Calls the server-only Netlify AI endpoint and produces useful diagnostics for empty/HTML responses. */
export async function requestAI(payload:unknown):Promise<{message:string}>{
 const response=await fetch('/.netlify/functions/assistant',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)});
 const raw=await response.text();
 let body:{message?:string;error?:string}={};
 try{body=raw?JSON.parse(raw) as {message?:string;error?:string}:{}}catch{throw new Error(`AI endpoint returned ${response.status} but not JSON. Run the app with “netlify dev” locally, or redeploy on Netlify. Check the Netlify Functions log for details.`)}
 if(!response.ok)throw new Error(body.error||`AI request failed (${response.status}). Check Netlify environment variables.`);
 if(!body.message)throw new Error('The AI endpoint returned an empty response. Check AI_API_URL, AI_API_KEY, AI_MODEL, and Netlify Function logs.');
 return {message:body.message};
}
