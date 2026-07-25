/**
 * UX-side throttle only. It slows repeated attempts in one browser; it is NOT a
 * security boundary. Configure Supabase Auth rate limits and CAPTCHA for real
 * server-side enforcement.
 */
type Entry={count:number;until:number};const attempts=new Map<string,Entry>();
export async function authDelay<T>(key:string,operation:()=>Promise<T>):Promise<T>{const now=Date.now(),entry=attempts.get(key);if(entry&&entry.until>now)throw new Error('Please wait a moment before trying again.');const started=performance.now();try{const result=await operation();attempts.delete(key);return result}catch(error){const count=(entry?.count||0)+1;const wait=Math.min(15*60_000,Math.max(1_000,2**count*1_000));attempts.set(key,{count,until:now+wait});throw error}finally{const elapsed=performance.now()-started;const minimum=900;if(elapsed<minimum)await new Promise(resolve=>setTimeout(resolve,minimum-elapsed))}}
