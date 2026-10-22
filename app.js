(function(){
  var WA='33767717586';
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}

  /* nav */
  var nav=$('#nav'),bg=$('#burger');
  if(bg)bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  $$('.drawer a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});
  addEventListener('scroll',function(){nav&&nav.classList.toggle('stuck',scrollY>10)},{passive:true});

  /* apparition */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});
    $$('.rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
  } else $$('.rv').forEach(function(el){el.classList.add('in')});

  /* simulateur */
  var sim=$('.sim');
  if(sim){
    var tabs=$$('.tabs button',sim),rows=$$('.row',sim),sum=$('#sum'),tot=$('#total'),link=$('#sim-wa'),city=sim.dataset.city||'';
    tabs.forEach(function(t){t.addEventListener('click',function(){
      tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);$('#p-'+x.dataset.tab).hidden=!on});
    })});
    function val(r){var q=+r.dataset.q||0,p=+r.dataset.p;return r.dataset.unit?(q?Math.max(49,q*p):0):q*p}
    function render(){
      var total=0,lines=[],html='';
      rows.forEach(function(r){
        var q=+r.dataset.q||0,u=r.dataset.unit;
        r.querySelector('output').textContent=u?q+' m²':q;
        if(!q)return;
        var v=val(r);total+=v;
        var label=u?r.dataset.name+' ('+q+' m²)':(q>1?q+' × ':'')+r.dataset.name;
        html+='<li><span>'+label+'</span><span>'+v+' €</span></li>';
        lines.push('- '+label+' : '+v+' €');
      });
      sum.innerHTML=html||'<li class="empty">Rien d\'ajouté pour l\'instant.</li>';
      tot.textContent=total.toLocaleString('fr-FR')+' €';
      tabs.forEach(function(t){var n=$$('#p-'+t.dataset.tab+' .row').reduce(function(a,r){return a+((+r.dataset.q||0)>0?1:0)},0),b=t.querySelector('.n');b.textContent=n;b.hidden=!n});
      var msg='Bonjour, je souhaite réserver un nettoyage'+(city?' à '+city:'')+' :\n'+(lines.length?lines.join('\n')+'\nTotal estimé : '+total+' €':'(à préciser)')+(city?'':'\nMa ville : ');
      link.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
    }
    rows.forEach(function(r){
      var b=r.querySelectorAll('button'),u=r.dataset.unit;
      b[0].addEventListener('click',function(){var q=+r.dataset.q||0;r.dataset.q=u?(q<=4?0:q-1):Math.max(0,q-1);render()});
      b[1].addEventListener('click',function(){var q=+r.dataset.q||0;r.dataset.q=u?(q?q+1:4):q+1;render()});
    });
    render();
  }

  /* formulaire -> WhatsApp */
  var f=$('#form');
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#f-name'),c=$('#f-city'),ok=true;
    [n,c].forEach(function(i){if(!i.value.trim()){i.style.borderColor='#DC2626';ok=false}else i.style.borderColor=''});
    if(!ok){(n.value.trim()?c:n).focus();return}
    var svc=$$('input[name=svc]:checked',f).map(function(i){return i.value}).join(', ')||'à préciser';
    var m=$('#f-msg').value.trim();
    var msg='Bonjour, je suis '+n.value.trim()+' ('+c.value+').\nJe souhaite un devis pour : '+svc+'.'+(m?'\n'+m:'');
    window.location.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
  });
})();
