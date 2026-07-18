/** Device-local date helpers. Never use UTC ISO slices for calendar UI. */
export const localDate=(value=new Date())=>{const y=value.getFullYear(),m=String(value.getMonth()+1).padStart(2,'0'),d=String(value.getDate()).padStart(2,'0');return `${y}-${m}-${d}`};
export const friendlyDate=(value=new Date())=>new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric'}).format(value);
export const weekRange=()=>{const now=new Date(),start=new Date(now);start.setDate(now.getDate()-now.getDay());const end=new Date(start);end.setDate(start.getDate()+6);const f=(d:Date)=>new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(d);return `${f(start)} — ${f(end)}`};
