export type Priority='high'|'medium'|'low'; export type TaskStatus='todo'|'doing'|'done';
export interface Task { id:string; title:string; subject:string; due:string; priority:Priority; status:TaskStatus; tags:string[]; subtasks?:{title:string;done:boolean}[]; archived?:boolean; createdAt:string }
export interface Habit {id:string; name:string; icon:string; color:string; target:number; completed:string[]; createdAt:string}
export interface ScheduleItem {id:string; title:string; day:number; start:string; end:string; kind:'class'|'study'|'event'; color:string; location?:string}
export interface Preferences {theme:'light'|'dark'|'superhero'|'anime'|'galaxy'|'nature'|'cyberpunk'; reminders:{classes:boolean; tasks:boolean; habits:boolean; overdue:boolean}; weekStartsMonday:boolean}
