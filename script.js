(()=>{
const d=document,b=d.body,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
b.classList.add('js');
/* header */
const head=d.querySelector('.site-head');
const onScroll=()=>head.classList.toggle('scrolled',scrollY>30);
onScroll();addEventListener('scroll',onScroll,{passive:true});
/* mobile menu */
const burger=d.querySelector('.burger'),menu=d.getElementById('menu');
const setMenu=o=>{b.classList.toggle('menu-open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');menu.setAttribute('aria-hidden',!o);if(o)menu.querySelector('a').focus({preventScroll:true})};
burger&&burger.addEventListener('click',()=>setMenu(!b.classList.contains('menu-open')));
addEventListener('keydown',e=>{if(e.key==='Escape'&&b.classList.contains('menu-open')){setMenu(false);burger.focus()}});
/* reveal */
const rv=[...d.querySelectorAll('.rv')];
if(rm||!('IntersectionObserver'in window)){rv.forEach(e=>e.classList.add('in'))}
else{const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});rv.forEach(e=>io.observe(e));
  setTimeout(()=>rv.forEach(e=>{if(e.getBoundingClientRect().top<innerHeight)e.classList.add('in')}),1800)}
/* counters */
const cs=d.querySelectorAll('[data-count]');
if(!rm&&'IntersectionObserver'in window){const co=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;co.unobserve(x.target);const el=x.target,t=+el.dataset.count,t0=performance.now();const step=n=>{const p=Math.min(1,(n-t0)/1400),v=Math.round(t*(1-Math.pow(1-p,3)));el.textContent=v;if(p<1)requestAnimationFrame(step)};el.textContent='0';requestAnimationFrame(step)}),{threshold:.6});cs.forEach(c=>co.observe(c))}
/* hero slideshow */
const slides=[...d.querySelectorAll('.slide')];
if(slides.length>1){const cap=d.querySelector('.sc-t'),dots=[...d.querySelectorAll('.dots i')];let i=0;
  const swap=n=>{slides[i].classList.remove('on');dots[i]&&dots[i].classList.remove('on');i=(n+slides.length)%slides.length;const s=slides[i];s.loading='eager';s.classList.remove('on');void s.offsetWidth;s.classList.add('on');dots[i]&&dots[i].classList.add('on');
    if(cap&&s.dataset.title)cap.textContent=s.dataset.title};
  const go=n=>{const k=(n+slides.length)%slides.length,s=slides[k];s.loading='eager';const ok=()=>swap(k);(s.complete&&s.naturalWidth)?ok():(s.decode?s.decode().then(ok,()=>{}):s.addEventListener('load',ok,{once:true}))};
  addEventListener('load',()=>slides.forEach(s=>s.loading='eager'));
  if(!rm)setInterval(()=>{if(!d.hidden)go(i+1)},5200)}
/* parallax */
const px=[...d.querySelectorAll('[data-parallax]')];
if(px.length&&!rm){let tick=false;const upd=()=>{tick=false;const vh=innerHeight;px.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;const c=(r.top+r.height/2-vh/2);el.style.setProperty('--py',(-c*parseFloat(el.dataset.parallax)).toFixed(1)+'px')})};
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()}
/* gallery filter */
const chips=[...d.querySelectorAll('.chip')];
chips.forEach(c=>c.addEventListener('click',()=>{const f=c.dataset.filter;chips.forEach(x=>{x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c)});
  c.closest('section').querySelectorAll('.m-item').forEach(it=>{const show=f==='all'||it.dataset.cat===f;it.hidden=!show;if(show){it.classList.add('in');it.classList.remove('pop');if(!rm){void it.offsetWidth;it.classList.add('pop')}}})}));
/* compare */
d.querySelectorAll('.compare').forEach(c=>{const r=c.querySelector('input');const set=()=>c.style.setProperty('--pos',r.value+'%');r.addEventListener('input',set);set()});
/* lightbox */
const lb=d.querySelector('.lb');
if(lb){const img=lb.querySelector('img'),T=lb.querySelector('.lb-t'),C=lb.querySelector('.lb-c'),L=lb.querySelector('.lb-l'),N=lb.querySelector('.lb-n');let list=[],idx=0,last=null;
  const vis=()=>[...d.querySelectorAll('[data-lb]')].filter(e=>e.offsetParent!==null);
  const show=n=>{idx=(n+list.length)%list.length;const e=list[idx];img.classList.remove('ready');const src=e.dataset.full;const pic=e.querySelector('img');img.alt=pic?pic.alt:'';
    const tmp=new Image();tmp.onload=()=>{img.src=src;requestAnimationFrame(()=>img.classList.add('ready'))};tmp.src=src;
    T.textContent=e.dataset.title||'';C.textContent=e.dataset.note||'';C.hidden=!e.dataset.note;
    if(e.dataset.link){L.href=e.dataset.link;L.hidden=false}else L.hidden=true;N.textContent=(idx+1)+' / '+list.length;
    [list[idx-1],list[idx+1]].forEach(x=>{if(x){const p=new Image();p.src=x.dataset.full}})};
  const open=e=>{last=e;list=vis();if(!list.includes(e))list=[e];lb.hidden=false;b.style.overflow='hidden';requestAnimationFrame(()=>lb.classList.add('open'));show(list.indexOf(e));lb.querySelector('.lb-x').focus()};
  const close=()=>{lb.classList.remove('open');b.style.overflow='';setTimeout(()=>{lb.hidden=true;img.removeAttribute('src')},rm?0:300);last&&last.focus({preventScroll:true})};
  d.addEventListener('click',e=>{const t=e.target.closest('[data-lb]');if(t){e.preventDefault();open(t)}});
  lb.querySelector('.lb-x').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',()=>show(idx-1));
  lb.querySelector('.lb-next').addEventListener('click',()=>show(idx+1));
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-fig'))close()});
  addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')show(idx+1);if(e.key==='ArrowLeft')show(idx-1);
    if(e.key==='Tab'){const f=[...lb.querySelectorAll('button,a:not([hidden])')];const i=f.indexOf(d.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
  let sx=null;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(idx+(dx<0?1:-1));sx=null})}
/* contact form -> mailto */
const form=d.querySelector('form[data-mail]');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const f=form,err=f.querySelector('.form-err');if(!f.checkValidity()){err.hidden=false;f.querySelector(':invalid').focus();return}err.hidden=true;
  location.href='mailto:'+f.dataset.mail+'?subject='+encodeURIComponent('Art enquiry from '+f.n.value)+'&body='+encodeURIComponent(f.m.value+'\n\n'+f.e.value)})}
/* page transition fallback (browsers without cross-document view transitions) */
const vt='CSSViewTransitionRule'in window;
if(!vt&&!rm){d.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank')return;const u=new URL(a.href,location.href);
  if(u.origin!==location.origin||u.pathname===location.pathname||a.hasAttribute('download')||!/\.html$|\/$/.test(u.pathname))return;e.preventDefault();b.classList.add('leaving');setTimeout(()=>location.href=u.href,260)})}
addEventListener('pageshow',e=>{if(e.persisted)b.classList.remove('leaving')});
})();
