const quotes=[
 ['The secret of getting ahead is getting started.','Mark Twain'],
 ['Success is the sum of small efforts, repeated day in and day out.','Robert Collier'],
 ['It always seems impossible until it’s done.','Nelson Mandela'],
 ['You do not have to be great to start, but you have to start to be great.','Zig Ziglar'],
 ['The future depends on what you do today.','Mahatma Gandhi'],
 ['Well begun is half done.','Aristotle'],
 ['Action is the foundational key to all success.','Pablo Picasso'],
 ['The journey of a thousand miles begins with one step.','Lao Tzu'],
 ['Great things are done by a series of small things brought together.','Vincent van Gogh'],
 ['Believe you can and you’re halfway there.','Theodore Roosevelt'],
] as const;
export const quoteOfTheDay=()=>{const d=new Date();const start=new Date(d.getFullYear(),0,0);const day=Math.floor((d.getTime()-start.getTime())/86400000);return quotes[day%quotes.length]};
