(function(){
  var WA='33767717586';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

  /* menu mobile */
  var nav=$('#nav'),bg=$('#burger');
  if(bg)bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  $$('.drawer a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});

  /* calculateur */
  var calc=$('#calc');
  if(calc){
    var items=$$('.item',calc),tot=$('#total'),link=$('#calc-wa');
    function update(){
      var sum=0,lines=[];
      items.forEach(function(it){
        var q=+it.dataset.q||0,p=+it.dataset.p,min=+it.dataset.min||0;
        it.querySelector('output').textContent=q+(it.dataset.step?' m²':'');
        if(!q)return;
        var v=it.dataset.step?Math.max(min,q*p):q*p;sum+=v;
        lines.push('- '+it.querySelector('b').textContent.replace(' (m²)','')+' : '+(it.dataset.step?q+' m²':q)+' ('+v+' €)');
      });
      tot.textContent=sum.toLocaleString('fr-FR')+' €';
      var msg='Bonjour, je souhaite réserver un nettoyage :\n'+(lines.length?lines.join('\n')+'\nTotal estimé : '+sum+' €':'(à préciser)')+'\nMa ville : ';
      link.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
    }
    items.forEach(function(it){
      var b=it.querySelectorAll('button'),step=it.dataset.step?1:1;
      b[0].addEventListener('click',function(){it.dataset.q=Math.max(0,(+it.dataset.q||0)-step);update()});
      b[1].addEventListener('click',function(){it.dataset.q=(+it.dataset.q||0)+(it.dataset.step&&!(+it.dataset.q)?4:step);update()});
    });
    var first=items[0]; if(first&&!first.dataset.step){first.dataset.q=1}
    update();
  }

  /* formulaire devis -> WhatsApp */
  var f=$('#form');
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#f-name'),c=$('#f-city'),ok=true;
    [n,c].forEach(function(i){if(!i.value.trim()){i.style.borderColor='#E5484D';ok=false}else i.style.borderColor=''});
    if(!ok){(n.value.trim()?c:n).focus();return}
    var svc=$$('input[name=svc]:checked',f).map(function(i){return i.value}).join(', ')||'à préciser';
    var msg='Bonjour, je suis '+n.value.trim()+' ('+c.value+').\nJe souhaite un devis pour : '+svc+'.'+($('#f-msg').value.trim()?'\n'+$('#f-msg').value.trim():'');
    window.location.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
  });

  /* bulles (accueil) */
  var cv=$('#bubbles');
  if(!cv)return;
  var ctx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W,H,list=[],pops=[],mouse={x:-999,y:-999},A='#2350FF',Q='#16B8DE';
  function rgba(h,a){var n=parseInt(h.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'}
  function mk(init){var r=6+Math.pow(Math.random(),2.2)*(W<700?26:60),right=W>960?.58:0;return {x:(right+Math.random()*(1-right))*W,y:init?Math.random()*H:H+r+Math.random()*80,r:r,vy:.15+Math.random()*.35+(70-r)/300,ph:Math.random()*6.28,wob:.3+Math.random()*.6,hue:Math.random()}}
  function size(){var d=Math.min(2,devicePixelRatio||1),b=cv.getBoundingClientRect();W=b.width;H=b.height;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);var n=Math.round(Math.min(24,Math.max(8,W/60)));list=[];for(var i=0;i<n;i++)list.push(mk(true))}
  function draw(b){var x=b.x,y=b.y,r=b.r,c=b.hue>.5?A:Q,g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);g.addColorStop(0,'rgba(255,255,255,'+(W<700?.25:.55)+')');g.addColorStop(.7,rgba(c,.07));g.addColorStop(1,rgba(c,.28));
    ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fillStyle=g;ctx.fill();ctx.lineWidth=1;ctx.strokeStyle=rgba(c,.35);ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,r*.93,2.3,3.7);ctx.strokeStyle=rgba(Q,.35);ctx.lineWidth=Math.max(1,r*.05);ctx.stroke();
    ctx.beginPath();ctx.ellipse(x-r*.38,y-r*.42,r*.22,r*.11,-.7,0,6.283);ctx.fillStyle='rgba(255,255,255,.9)';ctx.fill()}
  var t=0,vis=true;
  function frame(){t++;ctx.clearRect(0,0,W,H);
    list.forEach(function(b){if(!reduce){b.y-=b.vy;b.x+=Math.sin(t*.01*b.wob+b.ph)*.35;var dx=b.x-mouse.x,dy=b.y-mouse.y,d=Math.hypot(dx,dy);if(d<b.r+70&&d>0){b.x+=dx/d*1.6;b.y+=dy/d*1.6}if(b.y<-b.r-10){var n=mk(false);for(var k in n)b[k]=n[k]}}draw(b)});
    for(var i=pops.length-1;i>=0;i--){var p=pops[i];p.k+=.06;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(1+p.k*.6),0,6.283);ctx.strokeStyle=rgba(A,Math.max(0,.6-p.k*.6));ctx.lineWidth=1.5;ctx.stroke();if(p.k>1)pops.splice(i,1)}
    if(!reduce&&vis)requestAnimationFrame(frame)}
  var hero=cv.parentNode;
  hero.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
  hero.addEventListener('pointerleave',function(){mouse.x=mouse.y=-999});
  hero.addEventListener('click',function(e){if(e.target.closest('a,button,input,label,.calc'))return;var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;for(var i=0;i<list.length;i++){var b=list[i];if(Math.hypot(b.x-x,b.y-y)<b.r){pops.push({x:b.x,y:b.y,r:b.r,k:0});var n=mk(false);for(var k in n)b[k]=n[k];break}}});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!vis){vis=true;frame()}else vis=v}).observe(hero);
  addEventListener('resize',function(){size();if(reduce)frame()});
  size();frame();
})();
