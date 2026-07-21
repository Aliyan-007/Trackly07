export type AppTheme='light'|'dark'|'superhero'|'anime'|'galaxy'|'nature'|'cyberpunk';
export type ThemeConfig={id:AppTheme;label:string;description:string;icon:string};
export const themes:ThemeConfig[]=[
{id:'light',label:'Pearl',description:'Quiet pearl white',icon:'○'},
{id:'dark',label:'Midnight',description:'Warm black focus',icon:'◐'},
{id:'superhero',label:'Superhero',description:'Comic blue energy',icon:'✦'},
{id:'anime',label:'Anime',description:'Pastel classroom calm',icon:'✿'},
{id:'galaxy',label:'Galaxy',description:'Nebula glass',icon:'✧'},
{id:'nature',label:'Nature',description:'Forest clarity',icon:'◆'},
{id:'cyberpunk',label:'Cyberpunk',description:'Neon focus mode',icon:'◈'}];
