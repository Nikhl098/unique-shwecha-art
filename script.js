(function(){
var d=document,root=d.documentElement;root.classList.add('js');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// split headline into words
d.querySelectorAll('.split').forEach(function(el){
  var words=el.textContent.trim().split(/\s+/);el.setAttribute('aria-label',el.textContent.trim());
  el.innerHTML=words.map(function(w,i){return '<span class="w" aria-hidden="true"><span style="transition-delay:'+(0.08*i+0.1)+'s">'+w+'</span></span>'}).join(' ');
  requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('in')})});
});
// reveal
var rv=d.querySelectorAll('.rv,.step');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  rv.forEach(function(el){io.observe(el)});
}else rv.forEach(function(el){el.classList.add('in')});
// nav
var nav=d.getElementById('nav'),mbar=d.querySelector('.mbar'),hero=d.querySelector('.hero-card');
var stacks=[].slice.call(d.querySelectorAll('[data-stack]')),stay=d.querySelector('.stay-bg');
var ticking=false;
function onScroll(){
  var y=window.scrollY,vh=window.innerHeight;
  nav.classList.toggle('scrolled',y>40);
  if(mbar){var hb=hero.getBoundingClientRect().bottom;var fin=d.getElementById('contact').getBoundingClientRect().top;mbar.classList.toggle('show',hb<80&&fin>vh*.6)}
  if(!reduce){
    stacks.forEach(function(s){var r=s.getBoundingClientRect();var p=1-(r.top+r.height/2)/vh;p=Math.max(0,Math.min(1,(p-.05)*1.6));s.style.setProperty('--p',p.toFixed(3))});
    if(stay){var r=stay.parentNode.getBoundingClientRect();if(r.bottom>0&&r.top<vh){stay.style.setProperty('--py',(-(r.top/vh)*60-60).toFixed(1)+'px')}}
  }
  ticking=false;
}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
window.addEventListener('resize',onScroll);onScroll();
// menu
var mb=d.querySelector('.menu-btn'),menu=d.getElementById('menu');
function setMenu(open){mb.setAttribute('aria-expanded',open);mb.setAttribute('aria-label',open?'Close menu':'Open menu');menu.hidden=!open;d.body.style.overflow=open?'hidden':'';if(open)nav.classList.add('scrolled')}
mb.addEventListener('click',function(){setMenu(menu.hidden)});
menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden)setMenu(false)});
// hero slideshow
var hms=[].slice.call(d.querySelectorAll('.hm')),hi=0;
if(hms.length>1&&!reduce){setInterval(function(){hms[hi].classList.remove('on');hi=(hi+1)%hms.length;hms[hi].classList.add('on')},5200)}
// compare
d.querySelectorAll('[data-compare]').forEach(function(c){var i=c.querySelector('input');function set(){c.style.setProperty('--pos',i.value+'%')}i.addEventListener('input',set);set()});
// slider
var sl=d.getElementById('slider');
d.querySelectorAll('[data-sl]').forEach(function(b){b.addEventListener('click',function(){var it=sl.querySelector('.hl');var w=it?it.getBoundingClientRect().width+18:300;sl.scrollBy({left:w*+b.getAttribute('data-sl'),behavior:reduce?'auto':'smooth'})})});
// gallery filter
var chips=[].slice.call(d.querySelectorAll('.chip')),items=[].slice.call(d.querySelectorAll('.g-item'));
function filter(f){chips.forEach(function(c){var on=c.getAttribute('data-f')===f;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});items.forEach(function(it){it.classList.toggle('hide',f!=='all'&&it.getAttribute('data-cat')!==f)})}
chips.forEach(function(c){c.addEventListener('click',function(){filter(c.getAttribute('data-f'))})});
d.querySelectorAll('[data-filter-go]').forEach(function(a){a.addEventListener('click',function(){filter(a.getAttribute('data-filter-go'))})});
// lightbox
var lb=d.getElementById('lb'),lbf=lb.querySelector('figure'),lbi=d.createElement('img'),lbc=lb.querySelector('figcaption'),cur=0,last=null;
function vis(){return items.filter(function(it){return !it.classList.contains('hide')}).map(function(it){return it.querySelector('.g-btn')})}
function show(btn){if(!lbi.parentNode)lbf.insertBefore(lbi,lbf.firstChild);lbi.src=btn.getAttribute('data-full');lbi.alt=btn.querySelector('img').alt;lbc.textContent=btn.getAttribute('data-cap')}
function open(btn){last=btn;var v=vis();cur=v.indexOf(btn);show(btn);lb.hidden=false;d.body.style.overflow='hidden';d.body.classList.add('lb-open');lb.querySelector('.lb-x').focus()}
function close(){lb.hidden=true;d.body.style.overflow='';d.body.classList.remove('lb-open');if(last)last.focus()}
function step(n){var v=vis();cur=(cur+n+v.length)%v.length;show(v[cur])}
items.forEach(function(it){var b=it.querySelector('.g-btn');b.addEventListener('click',function(){open(b)})});
lb.querySelector('.lb-x').addEventListener('click',close);
lb.querySelector('.prev').addEventListener('click',function(){step(-1)});
lb.querySelector('.next').addEventListener('click',function(){step(1)});
lb.addEventListener('click',function(e){if(e.target===lb)close()});
d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)step(dx<0?1:-1);tx=null});
})();
