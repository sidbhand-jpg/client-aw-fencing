/* Fencing copy layer for the existing homepage and about-page layout. */
(() => {
  const niche = CONFIG.niche || 'Home Services';
  const market = CONFIG.primaryMarket || 'Charlotte';
  const serviceNames = () => CONFIG.services.map(s => s.name).join(', ');
  const setHeader = (id, eyebrow, title, subtitle = '', light = false) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = sectionHeaderHTML({ eyebrow, title, subtitle, light });
  };

  document.addEventListener('DOMContentLoaded', () => setTimeout(() => {
    document.querySelectorAll('[data-generic-niche]').forEach(node => { node.textContent = niche; });

    if (document.getElementById('hero-headline')) {
      document.title = `${CONFIG.businessName} | ${market} Area Fence & Gate Installation`;
      document.querySelector('meta[name="description"]').setAttribute('content', `${CONFIG.businessName} installs residential, commercial, and agricultural fences and custom gates in ${market} and surrounding communities. Request a free estimate.`);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogTitle) ogTitle.setAttribute('content', `${CONFIG.businessName} | ${market} Area Fence & Gate Installation`);
      if (ogDescription) ogDescription.setAttribute('content', `${CONFIG.businessName} installs residential, commercial, and agricultural fences and custom gates in ${market} and surrounding communities. Request a free estimate.`);
      const heroImage = document.getElementById('hero-img');
      if (heroImage) heroImage.alt = `${niche} professional at work`;
      document.querySelector('.hero-bullets').innerHTML = [
        'Clear communication from first call to final walkthrough',
        'Experienced local professionals who respect your property',
        'Straightforward estimates with no pressure',
      ].map(text => `<li class="hero-bullet"><svg class="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>${text}</li>`).join('');
      setHeader('why-section-header', 'Why choose us', `A better ${niche.toLowerCase()} experience.`, 'We combine helpful expertise, reliable scheduling, and workmanship you can feel confident about.');
      document.querySelector('.comparison-grid').innerHTML = `
        <div class="comparison-card comparison-bad"><div class="comparison-label"><span>✕</span> The frustrating way</div><ul class="comparison-points"><li><span class="dot dot-bad"></span>Vague timelines</li><li><span class="dot dot-bad"></span>Surprise changes</li><li><span class="dot dot-bad"></span>Poor communication</li><li><span class="dot dot-bad"></span>Rushed work</li></ul></div>
        <div class="comparison-card comparison-good"><div class="comparison-label"><span>✓</span> Our approach</div><ul class="comparison-points"><li><span class="dot dot-good"></span>Clear plan from the start</li><li><span class="dot dot-good"></span>Honest recommendations</li><li><span class="dot dot-good"></span>Responsive local team</li><li><span class="dot dot-good"></span>Careful final walkthrough</li></ul></div>`;
      setHeader('services-section-header', 'What we do', `${niche} services for your property.`, `Explore the services ${CONFIG.businessName} provides across ${market} and surrounding communities.`);
      setHeader('diff-section-header', 'The standard we work to', 'Professional service, without the runaround.', '', true);
      const diff = document.querySelector('.diff-grid');
      if (diff) diff.innerHTML = [
        ['Clear communication', 'You always know what happens next and who to contact.'],
        ['Respect for your property', 'We arrive prepared, work carefully, and leave the site tidy.'],
        ['Dependable scheduling', 'We set realistic expectations and keep you informed.'],
        ['Work we stand behind', 'Your satisfaction matters from the estimate through the walkthrough.'],
      ].map(([title, desc]) => `<div class="diff-card"><div class="diff-title">${title}</div><p class="diff-desc">${desc}</p></div>`).join('');
      setHeader('areas-section-header', 'Where we work', `Proudly serving ${market} and surrounding communities.`, 'Select a service area to learn more, or contact us to confirm availability.');
      setHeader('faq-section-header', 'Questions answered', `Common ${niche.toLowerCase()} questions.`);
    }

    if (document.getElementById('about-headline')) {
      document.title = `About A&W Fencing | Charlotte Area Fence Installation`;
      document.querySelector('meta[name="description"]').setAttribute('content', `Meet A&W Fencing, a Cherryville-based fence company serving Charlotte and surrounding North Carolina communities.`);
      document.getElementById('about-headline').textContent = `A local team that puts your project first.`;
      const prose = document.querySelector('.about-prose');
      if (prose) prose.innerHTML = `<p>${CONFIG.businessName} is based in Cherryville and serves Charlotte and surrounding communities with residential, commercial, and agricultural fencing and custom gates.</p><p>Our team plans around a property's purpose, layout, access, and maintenance needs, then discusses material and gate options with the owner.</p><p>Bring any survey, HOA requirements, and known utility or easement information to the estimate so the proposed fence suits the site.</p>`;
      const values = document.querySelector('.values-grid');
      if (values) values.innerHTML = [['Clear communication', 'We explain the plan and keep you informed.'], ['Respect for your property', 'We work carefully and leave your space tidy.'], ['Professional standards', 'We bring the experience and attention your project deserves.']].map(([title, desc]) => `<div class="value-card"><div class="value-title">${title}</div><p class="value-desc">${desc}</p></div>`).join('');
    }
  }, 0));
})();
