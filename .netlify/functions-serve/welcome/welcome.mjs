
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/welcome.mjs
var welcome_default = async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  if (!key || !from) return Response.json({ skipped: true });
  const { email, name } = await req.json();
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [email], subject: "Welcome to Trackly", html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h1>Welcome to Trackly, ${name || "there"}.</h1><p>Your calmer academic workspace is ready. Plan one small thing, then begin.</p></div>` }) });
  if (!response.ok) return Response.json({ error: "Could not send welcome email." }, { status: 500 });
  return Response.json({ sent: true });
};
export {
  welcome_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvd2VsY29tZS5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKiBPcHRpb25hbCBSZXNlbmQgd2VsY29tZSBlbWFpbC4gU2V0IFJFU0VORF9BUElfS0VZIGFuZCBSRVNFTkRfRlJPTSBpbiBOZXRsaWZ5LiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHJlcSkgPT4ge1xuIGlmKHJlcS5tZXRob2QhPT0nUE9TVCcpcmV0dXJuIG5ldyBSZXNwb25zZSgnTWV0aG9kIG5vdCBhbGxvd2VkJyx7c3RhdHVzOjQwNX0pO1xuIGNvbnN0IGtleT1wcm9jZXNzLmVudi5SRVNFTkRfQVBJX0tFWSxmcm9tPXByb2Nlc3MuZW52LlJFU0VORF9GUk9NO1xuIGlmKCFrZXl8fCFmcm9tKXJldHVybiBSZXNwb25zZS5qc29uKHtza2lwcGVkOnRydWV9KTtcbiBjb25zdCB7ZW1haWwsbmFtZX09YXdhaXQgcmVxLmpzb24oKTtcbiBjb25zdCByZXNwb25zZT1hd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkucmVzZW5kLmNvbS9lbWFpbHMnLHttZXRob2Q6J1BPU1QnLGhlYWRlcnM6e0F1dGhvcml6YXRpb246YEJlYXJlciAke2tleX1gLCdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJ30sYm9keTpKU09OLnN0cmluZ2lmeSh7ZnJvbSx0bzpbZW1haWxdLHN1YmplY3Q6J1dlbGNvbWUgdG8gVHJhY2tseScsaHRtbDpgPGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OkFyaWFsLHNhbnMtc2VyaWY7bWF4LXdpZHRoOjU2MHB4O21hcmdpbjphdXRvXCI+PGgxPldlbGNvbWUgdG8gVHJhY2tseSwgJHtuYW1lfHwndGhlcmUnfS48L2gxPjxwPllvdXIgY2FsbWVyIGFjYWRlbWljIHdvcmtzcGFjZSBpcyByZWFkeS4gUGxhbiBvbmUgc21hbGwgdGhpbmcsIHRoZW4gYmVnaW4uPC9wPjwvZGl2PmB9KX0pO1xuIGlmKCFyZXNwb25zZS5vaylyZXR1cm4gUmVzcG9uc2UuanNvbih7ZXJyb3I6J0NvdWxkIG5vdCBzZW5kIHdlbGNvbWUgZW1haWwuJ30se3N0YXR1czo1MDB9KTtyZXR1cm4gUmVzcG9uc2UuanNvbih7c2VudDp0cnVlfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUNBLElBQU8sa0JBQVEsT0FBTyxRQUFRO0FBQzdCLE1BQUcsSUFBSSxXQUFTLE9BQU8sUUFBTyxJQUFJLFNBQVMsc0JBQXFCLEVBQUMsUUFBTyxJQUFHLENBQUM7QUFDNUUsUUFBTSxNQUFJLFFBQVEsSUFBSSxnQkFBZSxPQUFLLFFBQVEsSUFBSTtBQUN0RCxNQUFHLENBQUMsT0FBSyxDQUFDLEtBQUssUUFBTyxTQUFTLEtBQUssRUFBQyxTQUFRLEtBQUksQ0FBQztBQUNsRCxRQUFNLEVBQUMsT0FBTSxLQUFJLElBQUUsTUFBTSxJQUFJLEtBQUs7QUFDbEMsUUFBTSxXQUFTLE1BQU0sTUFBTSxpQ0FBZ0MsRUFBQyxRQUFPLFFBQU8sU0FBUSxFQUFDLGVBQWMsVUFBVSxHQUFHLElBQUcsZ0JBQWUsbUJBQWtCLEdBQUUsTUFBSyxLQUFLLFVBQVUsRUFBQyxNQUFLLElBQUcsQ0FBQyxLQUFLLEdBQUUsU0FBUSxzQkFBcUIsTUFBSyxpR0FBaUcsUUFBTSxPQUFPLGdHQUErRixDQUFDLEVBQUMsQ0FBQztBQUMzYSxNQUFHLENBQUMsU0FBUyxHQUFHLFFBQU8sU0FBUyxLQUFLLEVBQUMsT0FBTSxnQ0FBK0IsR0FBRSxFQUFDLFFBQU8sSUFBRyxDQUFDO0FBQUUsU0FBTyxTQUFTLEtBQUssRUFBQyxNQUFLLEtBQUksQ0FBQztBQUM1SDsiLAogICJuYW1lcyI6IFtdCn0K
