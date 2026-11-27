"use client";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {loadPersonalWorkPageAction} from "../actions/personal-work.actions";
import type {PersonalWorkItem, PersonalWorkListPage, PersonalWorkPageData} from "../shared/personal-work.types";
import type {WorkListQuery} from "../shared/work-list-query";

const queryKey=(query:WorkListQuery)=>JSON.stringify([query.view,query.scope,query.domain,query.day]);
// Link-only calendar refreshes do not invalidate rows or queue another list action.
function indexRevision(items:PersonalWorkItem[]){return JSON.stringify([...items].sort((a,b)=>a.id.localeCompare(b.id)).map(item=>[item.id,item.updatedAt,item.status,item.dueAt,item.scheduledEndAt,item.estimatedDays,item.progressPercent,item.progressMode,item.checklistLockedAt,item.category,item.workType,item.access,item.assignedToMe,item.assignee,item.owner,item.tags,item.sharedWith,item.checklistOnly,item.checklist]));}

export function useWorkListPage(enabled:boolean,query:WorkListQuery,source:PersonalWorkItem[],initial?:PersonalWorkPageData["initialList"],refreshSource:PersonalWorkItem[]=source){
  const key=queryKey(query),latest=useRef(query);latest.current=query;
  const revision=useMemo(()=>indexRevision(source),[source]);
  const seedRevision=useMemo(()=>indexRevision(refreshSource),[refreshSource]);
  const seed=initial&&queryKey(initial.query)===key&&revision===seedRevision?initial.page:undefined;
  const generation=useMemo(()=>({value:0}),[]),busy=useRef(false),desired=useRef(30),lastKey=useRef(key);
  const [state,setState]=useState<{key:string;items:PersonalWorkItem[];cursor:string|null;loading:boolean;refreshing:boolean;error:string;total:number}>(()=>({key,items:seed?.items??[],cursor:seed?.nextCursor??null,loading:enabled&&!seed,refreshing:false,error:"",total:seed?.total??0}));
  const failedReset=useRef(false),current=useRef(state);current.current=state;
  const load=useCallback(async(reset=false,firstPage?:PersonalWorkListPage)=>{
    if(!enabled||busy.current)return;
    busy.current=true;const version=generation.value,requestKey=queryKey(latest.current),previous=current.current;
    let cursor=reset?firstPage?.nextCursor??null:previous.cursor,rows=reset?firstPage?.items??[]:previous.items;
    setState(s=>({...s,key:requestKey,loading:true,refreshing:reset&&previous.key===requestKey&&previous.items.length>0,error:""}));
    try{
      let total=firstPage?.total??previous.total,restarts=0;
      if(!firstPage||cursor&&rows.length<desired.current){
        do{
          const result=await loadPersonalWorkPageAction({...latest.current,cursor});
          if(version!==generation.value)return;
          if(result.restart){if(++restarts>1)throw new Error("List changed");cursor=null;rows=[];continue;}
          const deduped=new Map(rows.map(item=>[item.id,item]));result.items.forEach(item=>deduped.set(item.id,item));rows=[...deduped.values()];
          cursor=result.nextCursor;total=result.total;
          if(!reset||!cursor||rows.length>=desired.current)break;
        }while(true);
      }
      if(version===generation.value){desired.current=Math.max(30,rows.length);setState({key:requestKey,items:rows,cursor,loading:false,refreshing:false,error:"",total});}
    }catch{if(version===generation.value){failedReset.current=reset;setState(s=>({...s,loading:false,refreshing:false,error:"Không tải được danh sách. Vui lòng thử lại."}));}}
    finally{if(version===generation.value)busy.current=false;}
  },[enabled,generation]);
  const sentinel=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    generation.value++;busy.current=false;
    if(lastKey.current!==key){const pane=sentinel.current?.closest<HTMLElement>('[role="list"]');if(pane)pane.scrollTop=0;lastKey.current=key;desired.current=30;setState({key,items:[],cursor:null,loading:enabled,refreshing:false,error:"",total:0});}
    if(enabled)void load(true,seed);
    return()=>{generation.value++;busy.current=false;};
  },[key,revision,refreshSource,seed,enabled,load,generation]);
  const hasMore=state.key===key&&Boolean(state.cursor);
  useEffect(()=>{
    if(!enabled||!hasMore||state.loading||state.error||!sentinel.current)return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))void load();},{root:sentinel.current.closest('[role="list"]'),rootMargin:"180px 0px"});
    observer.observe(sentinel.current);return()=>observer.disconnect();
  },[enabled,hasMore,state.loading,state.error,load]);
  return {...state,items:state.key===key?state.items:[],loading:state.key!==key||state.loading,hasMore,sentinel,retry:()=>load(current.current.error?failedReset.current:!current.current.items.length)};
}
