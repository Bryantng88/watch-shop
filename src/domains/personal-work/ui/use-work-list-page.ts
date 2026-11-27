"use client";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {loadPersonalWorkPageAction} from "../actions/personal-work.actions";
import type {PersonalWorkItem} from "../shared/personal-work.types";
import type {WorkListQuery} from "../shared/work-list-query";

export function useWorkListPage(enabled: boolean, query: WorkListQuery, source: PersonalWorkItem[]) {
  const key=JSON.stringify(query), latest=useRef(query); latest.current=query;
  const generation=useMemo(()=>({value:0}),[]), busy=useRef(false), desired=useRef(30), lastKey=useRef(key);
  const [state,setState]=useState<{key:string;items:PersonalWorkItem[];cursor:string|null;loading:boolean;error:string;total:number}>({key,items:[],cursor:null,loading:enabled,error:"",total:0});
  const failedReset=useRef(false);
  const current=useRef(state);current.current=state;
  const load=useCallback(async(reset=false)=>{
    if(!enabled||busy.current)return;
    busy.current=true;const version=generation.value, requestKey=JSON.stringify(latest.current);
    const previous=current.current;
    let cursor=reset?null:previous.cursor, rows=reset?[]:previous.items;
    setState(s=>({...s,key:requestKey,loading:true,error:""}));
    try {
      let total=previous.total, restarts=0;
      do {
        const result=await loadPersonalWorkPageAction({...latest.current,cursor});
        if(version!==generation.value)return;
        if(result.restart){if(++restarts>1)throw new Error("List changed");cursor=null;rows=[];continue;}
        const deduped=new Map(rows.map(item=>[item.id,item]));result.items.forEach(item=>deduped.set(item.id,item));rows=[...deduped.values()];
        cursor=result.nextCursor;total=result.total;
        if(!reset||!cursor||rows.length>=desired.current)break;
      } while(true);
      if(version===generation.value){desired.current=Math.max(30,rows.length);setState({key:requestKey,items:rows,cursor,loading:false,error:"",total});}
    }catch{failedReset.current=reset;if(version===generation.value)setState(s=>({...s,loading:false,error:"Không tải được danh sách. Vui lòng thử lại."}));}
    finally{if(version===generation.value)busy.current=false;}
  },[enabled,generation]);
  useEffect(()=>{
    generation.value++;busy.current=false;
    if(lastKey.current!==key){const pane=sentinel.current?.closest<HTMLElement>('[role="list"]');if(pane)pane.scrollTop=0;lastKey.current=key;desired.current=30;setState({key,items:[],cursor:null,loading:enabled,error:"",total:0});}
    if(enabled)void load(true);
    return()=>{generation.value++;busy.current=false;};
  },[key,source,enabled,load,generation]);
  const sentinel=useRef<HTMLDivElement>(null);
  const hasMore=state.key===key&&Boolean(state.cursor);
  useEffect(()=>{
    if(!enabled||!hasMore||state.loading||state.error||!sentinel.current)return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))void load();},{root:sentinel.current.closest('[role="list"]'),rootMargin:"180px 0px"});
    observer.observe(sentinel.current);return()=>observer.disconnect();
  },[enabled,hasMore,state.loading,state.error,load]);
  return {...state,items:state.key===key?state.items:[],loading:state.key!==key||state.loading,hasMore,sentinel,retry:()=>load(current.current.error?failedReset.current:!current.current.items.length)};
}
