'use client';
import {useEffect} from 'react';

/** Magnetic follow with one spring per button: new targets replace old targets
 * rather than stacking tweens. Translation stays independent of hover effects. */
export function useInteractions(){
  useEffect(()=>{
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const selector='.treatment-info-card,.contact-steps>li,.contact-answers article,.about-clinic-photo,.film-hero';
    let active:HTMLElement|null=null,frame=0,latest:PointerEvent|null=null;
    const clear=()=>{cancelAnimationFrame(frame);frame=0;latest=null;if(active){['--hover-x','--hover-y','--tilt-x','--tilt-y'].forEach(k=>active?.style.removeProperty(k));active.classList.remove('pointer-active');active=null}};
    const update=()=>{frame=0;const e=latest;if(!e)return;const target=e.target instanceof Element?e.target.closest<HTMLElement>(selector):null;
      if(active!==target){if(active){['--hover-x','--hover-y','--tilt-x','--tilt-y'].forEach(k=>active?.style.removeProperty(k));active.classList.remove('pointer-active')}active=target}
      if(!active)return;const r=active.getBoundingClientRect();const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
      active.style.setProperty('--hover-x',`${(x*100).toFixed(1)}%`);active.style.setProperty('--hover-y',`${(y*100).toFixed(1)}%`);
      active.style.setProperty('--tilt-x',`${((.5-y)*3).toFixed(2)}deg`);active.style.setProperty('--tilt-y',`${((x-.5)*3).toFixed(2)}deg`);active.classList.add('pointer-active');
    };
    const move=(e:PointerEvent)=>{if(!fine.matches||reduced.matches||e.pointerType!=='mouse')return;latest=e;if(!frame)frame=requestAnimationFrame(update)};
    document.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',clear);window.addEventListener('blur',clear);window.addEventListener('scroll',clear,{passive:true});fine.addEventListener('change',clear);reduced.addEventListener('change',clear);
    return()=>{clear();document.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',clear);window.removeEventListener('blur',clear);window.removeEventListener('scroll',clear);fine.removeEventListener('change',clear);reduced.removeEventListener('change',clear)};
  },[]);

  useEffect(()=>{
    const pointer=matchMedia('(hover: hover) and (pointer: fine)');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    type Motion={x:number;y:number;vx:number;vy:number;tx:number;ty:number};
    const states=new Map<HTMLElement,Motion>();
    let frame=0,last=0;
    const reset=()=>{cancelAnimationFrame(frame);frame=0;last=0;states.forEach((_,el)=>{el.style.removeProperty('--mag-x');el.style.removeProperty('--mag-y')});states.clear()};
    const tick=(now:number)=>{
      const dt=Math.min((now-(last||now-16.67))/16.67,2);last=now;let moving=false;
      states.forEach((s,el)=>{
        if(!el.isConnected){states.delete(el);return;}
        s.vx=(s.vx+(s.tx-s.x)*.095*dt)*Math.pow(.65,dt);
        s.vy=(s.vy+(s.ty-s.y)*.095*dt)*Math.pow(.65,dt);
        s.x+=s.vx*dt;s.y+=s.vy*dt;
        const settled=Math.abs(s.tx-s.x)+Math.abs(s.ty-s.y)+Math.abs(s.vx)+Math.abs(s.vy)<.025;
        el.style.setProperty('--mag-x',`${settled?s.tx:s.x}px`);
        el.style.setProperty('--mag-y',`${settled?s.ty:s.y}px`);
        if(!settled)moving=true;
        else if(s.tx===0&&s.ty===0){states.delete(el);el.style.removeProperty('--mag-x');el.style.removeProperty('--mag-y');}
      });
      if(moving)frame=requestAnimationFrame(tick);else{frame=0;last=0;}
    };
    const start=()=>{if(!frame)frame=requestAnimationFrame(tick)};
    const move=(e:PointerEvent)=>{
      if(!pointer.matches||reduced.matches||e.pointerType!=='mouse')return;
      const target=e.target instanceof Element?e.target.closest<HTMLElement>('.btn:not(:disabled)'):null;
      states.forEach((s,el)=>{if(el!==target){s.tx=0;s.ty=0;}});
      if(target){
        let s=states.get(target);if(!s){s={x:0,y:0,vx:0,vy:0,tx:0,ty:0};states.set(target,s)}
        const r=target.getBoundingClientRect();
        // Remove the current translation from the rect to avoid feedback drift.
        const x=e.clientX-(r.left-s.x+r.width/2),y=e.clientY-(r.top-s.y+r.height/2);
        s.tx=Math.max(-7,Math.min(7,x*.12));s.ty=Math.max(-5,Math.min(5,y*.18));
        target.style.setProperty('--pointer-x',`${Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))}%`);
      }
      if(states.size)start();
    };
    const leave=()=>{states.forEach(s=>{s.tx=0;s.ty=0});if(states.size)start()};
    document.addEventListener('pointermove',move,{passive:true});
    document.documentElement.addEventListener('pointerleave',leave);
    window.addEventListener('blur',reset);window.addEventListener('scroll',leave,{passive:true});
    reduced.addEventListener('change',reset);pointer.addEventListener('change',reset);
    return()=>{reset();document.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);window.removeEventListener('blur',reset);window.removeEventListener('scroll',leave);reduced.removeEventListener('change',reset);pointer.removeEventListener('change',reset)};
  },[]);
}
