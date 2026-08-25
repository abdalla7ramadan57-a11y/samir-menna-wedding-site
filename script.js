const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const WISH_KEY='samir_menna_wishes_v3';
const RSVP_KEY='samir_menna_rsvps_v3';
const prelude=$('#prelude');
const envelopeStage=$('#envelopeStage');
const envelope=$('.envelope');
const site=$('#site');
const music=$('#weddingMusic');
const musicToggle=$('#musicToggle');
const guestbookTrack=$('#guestbookTrack');
const clean=(s='')=>String(s).trim().replace(/\s+/g,' ');
const getStore=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}};
const setStore=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

function switchScreen(from,to,delay=280){
  from.classList.remove('active');
  from.setAttribute('aria-hidden','true');
  setTimeout(()=>{
    to.classList.add('active');
    to.setAttribute('aria-hidden','false');
  },delay);
}

function addWish(name,message){
  const rows=getStore(WISH_KEY);
  rows.unshift({name:clean(name),message:clean(message),createdAt:new Date().toISOString()});
  setStore(WISH_KEY,rows.slice(0,100));
  renderWishes();
}

function renderWishes(){
  const rows=getStore(WISH_KEY);
  const data=rows.length?rows:[{name:'Samir & Menna',message:'سيبولنا دعوة حلوة نفتكرها منكم دايمًا.',createdAt:new Date().toISOString()}];
  guestbookTrack.innerHTML='';
  data.forEach(w=>{
    const card=document.createElement('article'); card.className='wish-card';
    const n=document.createElement('strong'); n.textContent=w.name;
    const p=document.createElement('p'); p.textContent='“'+w.message+'”';
    const t=document.createElement('time');
    t.textContent=new Date(w.createdAt).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
    card.append(n,p,t); guestbookTrack.append(card);
  });
}

function goEnvelope(){switchScreen(prelude,envelopeStage)}
$('#openingWishForm').addEventListener('submit',e=>{
  e.preventDefault();
  addWish($('#openingName').value,$('#openingMessage').value);
  goEnvelope();
});
$('#skipWish').addEventListener('click',goEnvelope);

$('#sealButton').addEventListener('click',async()=>{
  if(envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  await startMusic();
  setTimeout(()=>enterInvitation(),1050);
});

function enterInvitation(){
  envelopeStage.classList.remove('active');
  envelopeStage.setAttribute('aria-hidden','true');
  site.classList.add('active');
  site.setAttribute('aria-hidden','false');
  document.body.classList.remove('locked');
  window.scrollTo(0,0);
  requestAnimationFrame(()=>$$('.reveal-text,.reveal-photo').forEach(el=>io.observe(el)));
}

async function startMusic(){
  try{
    music.volume=.72;
    await music.play();
    musicToggle.setAttribute('aria-pressed','true');
    musicToggle.querySelector('span').textContent='ON';
  }catch{
    musicToggle.setAttribute('aria-pressed','false');
    musicToggle.querySelector('span').textContent='OFF';
  }
}


musicToggle.addEventListener('click',async()=>{
  if(music.paused){
    try{await music.play();musicToggle.setAttribute('aria-pressed','true');musicToggle.querySelector('span').textContent='ON'}catch{}
  }else{
    music.pause();musicToggle.setAttribute('aria-pressed','false');musicToggle.querySelector('span').textContent='OFF';
  }
});

function countdown(){
  const target=new Date('2026-10-23T16:00:00+03:00').getTime();
  let d=Math.max(0,target-Date.now());
  const days=Math.floor(d/86400000); d%=86400000;
  const hours=Math.floor(d/3600000); d%=3600000;
  const minutes=Math.floor(d/60000); d%=60000;
  const seconds=Math.floor(d/1000);
  $('#days').textContent=String(days).padStart(3,'0');
  $('#hours').textContent=String(hours).padStart(2,'0');
  $('#minutes').textContent=String(minutes).padStart(2,'0');
  $('#seconds').textContent=String(seconds).padStart(2,'0');
}
countdown(); setInterval(countdown,1000);

$('#wishForm').addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget);
  addWish(fd.get('name'),fd.get('message'));
  e.currentTarget.reset();
  guestbookTrack.scrollTo({left:0,behavior:'smooth'});
});

$('#rsvpForm').addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget); const rows=getStore(RSVP_KEY);
  rows.unshift({name:clean(fd.get('name')),attendance:fd.get('attendance'),message:clean(fd.get('message')||''),createdAt:new Date().toISOString()});
  setStore(RSVP_KEY,rows);
  e.currentTarget.reset();
  $('#rsvpStatus').textContent='Thank you — تم تسجيل ردكم.';
});

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}
}),{threshold:.13,rootMargin:'0px 0px -5%'});

const lightbox=$('#lightbox'),lightboxImage=$('#lightboxImage');
$$('.gallery-shot').forEach(btn=>btn.addEventListener('click',()=>{lightboxImage.src=btn.querySelector('img').src;lightbox.showModal()}));
$('#closeLightbox').addEventListener('click',()=>lightbox.close());

const shareDialog=$('#shareDialog');
$('#shareBtn').addEventListener('click',async()=>{
  if(navigator.share){
    try{await navigator.share({title:'Samir & Menna — 23 • 10 • 2026',text:'Join us as we celebrate our wedding.',url:location.href});return}catch{}
  }
  shareDialog.showModal();
});
$('#closeShare').addEventListener('click',()=>shareDialog.close());
$('#whatsappShare').href='https://wa.me/?text='+encodeURIComponent('Samir & Menna — 23 • 10 • 2026\n'+location.href);
$('#copyLink').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(location.href);$('#copyLink').querySelector('span').textContent='COPIED';setTimeout(()=>$('#copyLink').querySelector('span').textContent='COPY LINK',1200)}catch{}
});

$('#adminExport').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify({rsvps:getStore(RSVP_KEY),wishes:getStore(WISH_KEY),exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='samir-menna-rsvp-export.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);
});

renderWishes();
