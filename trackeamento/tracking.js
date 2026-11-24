(() => {
  'use strict';
  const motionToggle = document.querySelector('#motion-toggle');
  const heroMap = document.querySelector('.hero-map');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cycleToggle = document.querySelector('#cycle-motion-toggle');
  const cycle = document.querySelector('.customer-cycle');
  const updateMotion = () => {
    const paused = reducedMotion.matches || motionToggle.getAttribute('aria-pressed') === 'true';
    heroMap.classList.toggle('motion-enabled', !paused);
    motionToggle.hidden = reducedMotion.matches;
    cycle.classList.toggle('cycle-animated', !reducedMotion.matches && cycleToggle.getAttribute('aria-pressed') !== 'true');
    cycleToggle.hidden = reducedMotion.matches;
  };
  updateMotion();
  reducedMotion.addEventListener('change', updateMotion);
  cycleToggle.addEventListener('click', () => {
    const paused = cycleToggle.getAttribute('aria-pressed') !== 'true';
    cycleToggle.setAttribute('aria-pressed', String(paused));
    cycleToggle.textContent = paused ? 'Retomar ciclo' : 'Pausar ciclo';
    updateMotion();
  });
  motionToggle.addEventListener('click', () => {
    const paused = motionToggle.getAttribute('aria-pressed') !== 'true';
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.textContent = paused ? 'Retomar animação' : 'Pausar animação';
    updateMotion();
  });
  const sourceSwitch = document.querySelector('.source-switch');
  sourceSwitch.hidden = false;
  const sources = {
    meta: ['Ana vê seu anúncio no Instagram', 'Ela encontra sua empresa enquanto olha o feed.'],
    google: ['Ana encontra seu anúncio no Google', 'Ela pesquisa pelo serviço e chega ao seu site antes de conversar.']
  };
  sourceSwitch.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-source]');
    if (!button) return;
    sourceSwitch.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const [title, copy] = sources[button.dataset.source];
    document.querySelector('#origin-title').textContent = title;
    document.querySelector('#origin-copy').textContent = copy;
  });

  const reveal = document.querySelector('#reveal-sales');
  const rows = document.querySelectorAll('.sales-row');
  const insight = document.querySelector('#comparison-insight');
  const fullInsight = insight.textContent;
  rows.forEach((row) => { row.hidden = true; });
  insight.textContent = 'O A trouxe o dobro de conversas. Você colocaria mais dinheiro nele? Antes de decidir, veja o que aconteceu depois.';
  reveal.hidden = false;
  reveal.addEventListener('click', () => {
    const expanded = reveal.getAttribute('aria-expanded') !== 'true';
    rows.forEach((row) => { row.hidden = !expanded; });
    reveal.setAttribute('aria-expanded', String(expanded));
    reveal.textContent = expanded ? 'Ver só as conversas' : 'Revelar as vendas';
    reveal.closest('section').classList.toggle('sales-revealed', expanded);
    insight.textContent = expanded ? fullInsight : 'O A trouxe o dobro de conversas. Você colocaria mais dinheiro nele? Antes de decidir, veja o que aconteceu depois.';
  });

  const segmentFilters = document.querySelector('.segment-filters');
  const segmentButtons = [...document.querySelectorAll('.segment-option')];
  const segmentExample = document.querySelector('.segment-example');
  let segmentAnimation;
  function selectSegment(button) {
    segmentButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#segment-name').textContent = button.querySelector('span').textContent;
    document.querySelector('#segment-action').textContent = button.dataset.action;
    document.querySelector('#segment-result').textContent = button.dataset.result;
    if (!reducedMotion.matches) {
      segmentAnimation?.cancel();
      segmentAnimation = segmentExample.animate([{opacity:.55,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
      button.querySelector('svg').animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
    }
  }
  segmentFilters.hidden = false;
  document.querySelector('.segment-grid').addEventListener('click', event => {
    const button = event.target.closest('.segment-option');
    if (button) selectSegment(button);
  });
  segmentFilters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    segmentFilters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    segmentButtons.forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.group !== button.dataset.filter; });
    const selected = segmentButtons.find(item => item.getAttribute('aria-pressed') === 'true');
    if (selected.hidden) selectSegment(segmentButtons.find(item => !item.hidden));
    if (!reducedMotion.matches) segmentButtons.filter(item => !item.hidden).forEach((item,index)=>item.animate([{opacity:.5,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,delay:Math.min(index*20,200),easing:'cubic-bezier(.22,1,.36,1)'}));
  });
  reducedMotion.addEventListener('change', () => { if(reducedMotion.matches) { segmentAnimation?.cancel(); document.querySelectorAll('#para-quem *').forEach(el=>el.getAnimations().forEach(animation=>animation.cancel())); } });

  const form = document.querySelector('#tracking-form');
  const touched = new Set();
  const fields = [...form.querySelectorAll('input:not([type="hidden"]), select')];
  form.noValidate = true;
  function validate(field) {
    const value = field.value.trim();
    let message = '';
    if (!value) message = field.name === 'channel' ? 'Selecione onde você anuncia hoje.' : 'Preencha este campo para preparar sua mensagem.';
    if (field.name === 'phone' && value) {
      const raw = value.replace(/\D/g, '');
      const national = raw.startsWith('55') && raw.length > 11 ? raw.slice(2) : raw;
      if (!/^\d{10,11}$/.test(national)) message = 'Informe um WhatsApp com DDD e 10 ou 11 dígitos.';
    }
    const error = document.getElementById(field.getAttribute('aria-describedby'));
    error.textContent = message;
    error.hidden = !message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  fields.forEach((field) => {
    field.addEventListener('blur', () => { touched.add(field); validate(field); });
    field.addEventListener('input', () => { if (touched.has(field)) validate(field); });
    field.addEventListener('change', () => { if (touched.has(field)) validate(field); });
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) { invalid[0].focus(); return; }
    const data = new FormData(form);
    const message = `Olá! Meu nome é ${data.get('name').trim()}, sou da empresa ${data.get('business').trim()}.\nMeu WhatsApp é ${data.get('phone').trim()}.\nOnde anuncio: ${data.get('channel')}.\nQuero entender como trackear minhas campanhas e as vendas pelo WhatsApp. Vim da página de trackeamento da Gatu.`;
    // Abrir o WhatsApp não confirma envio da mensagem nem uma venda.
    window.location.assign(`https://wa.me/5531975625629?text=${encodeURIComponent(message)}`);
  });
})();
