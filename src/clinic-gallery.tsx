'use client';
import {useEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,Pause,Play,ExternalLink} from 'lucide-react';
const photos=[
 {src:'/galeria/unidade-3.webp',title:'Recepção e sala de espera',alt:'Recepção da Oral Centter de Patos de Minas, com cadeiras, balcão e espaço de espera'},
 {src:'/galeria/unidade-9.webp',title:'Outro olhar sobre a recepção',alt:'Vista interna da recepção da Oral Centter, com balcão de atendimento e entrada'},
 {src:'/galeria/unidade-4.webp',title:'Consultório odontológico',alt:'Consultório da unidade Oral Centter em Patos de Minas, com cadeira e equipamentos odontológicos'},
 {src:'/galeria/unidade-1.webp',title:'Fachada da unidade',alt:'Fachada azul da Oral Centter na Rua Agenor Maciel, 245, em Patos de Minas'},
];
export default function ClinicGallery(){
 const [index,setIndex]=useState(0),[playing,setPlaying]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[visible,setVisible]=useState(false),[pageVisible,setPageVisible]=useState(true),[reduced,setReduced]=useState(false);
 const root=useRef<HTMLDivElement>(null),touchX=useRef<number|null>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');setReduced(media.matches);setPlaying(!media.matches);const change=()=>{setReduced(media.matches);if(media.matches)setPlaying(false)};media.addEventListener('change',change);const visibility=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});if(root.current)observer.observe(root.current);return()=>{observer.disconnect();media.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility)}},[]);
 const automatic=playing&&!hovered&&!focused&&visible&&pageVisible&&!reduced;
 useEffect(()=>{if(!automatic)return;const id=setInterval(()=>setIndex(i=>(i+1)%photos.length),5000);return()=>clearInterval(id)},[automatic,index]);
 const choose=(i:number)=>{setIndex((i+photos.length)%photos.length);setPlaying(false)};
 return <div ref={root} className="clinic-gallery" role="region" aria-roledescription="carrossel" aria-label="Fotos da Oral Centter de Patos de Minas" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();choose(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();choose(index-1)}}} onTouchStart={e=>{touchX.current=e.touches[0].clientX}} onTouchEnd={e=>{if(touchX.current!==null){const diff=e.changedTouches[0].clientX-touchX.current;if(Math.abs(diff)>45)choose(index+(diff<0?1:-1))}touchX.current=null}}>
  <div className="clinic-gallery-stage" aria-live={automatic?'off':'polite'}><div className="clinic-gallery-slide" key={index} role="group" aria-roledescription="slide" aria-label={`${index+1} de ${photos.length}: ${photos[index].title}`}><img src={photos[index].src} alt={photos[index].alt} width={1600} height={1200} loading="lazy" decoding="async"/></div><div className="gallery-counter" aria-hidden="true">{String(index+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</div></div>
  <div className="gallery-caption"><div><span>CONHEÇA NOSSO ESPAÇO</span><h3>{photos[index].title}</h3></div><div className="gallery-controls"><button aria-label="Foto anterior" onClick={()=>choose(index-1)}><ChevronLeft size={20}/></button><button aria-label={playing?'Pausar troca automática':'Ativar troca automática'} aria-pressed={playing} onClick={()=>{setPlaying(!playing);if(!playing)setFocused(false)}}>{playing?<Pause size={16}/>:<Play size={16}/>}</button><button aria-label="Próxima foto" onClick={()=>choose(index+1)}><ChevronRight size={20}/></button></div></div>
  <div className="gallery-thumbnails" aria-label="Escolher foto">{photos.map((p,i)=><button key={p.src} className={i===index?'current':''} aria-label={`Ver foto: ${p.title}`} aria-current={i===index?'true':undefined} onClick={()=>choose(i)}><img src={p.src} alt="" width={90} height={68} loading="lazy"/></button>)}</div>
  <a className="gallery-source" href="https://www.google.com/maps/search/?api=1&query=Oral+Centter+Patos+de+Minas&query_place_id=ChIJw72KIS6LrpQREbbY65uTy8k" target="_blank" rel="noopener noreferrer">Fotos da unidade no Google Maps <ExternalLink size={12}/></a>
 </div>
}
