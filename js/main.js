(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');
  const tabs = [...document.querySelectorAll('.house-tab')];
  const hero = document.querySelector('.hero-img-placeholder');
  const propertyTabs = [...document.querySelectorAll('.prop-tab')];

  const heroImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85'
  ];
  const setSlide = (index) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active);
    });
    if (hero) hero.style.backgroundImage = `url("${heroImages[index]}")`;
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => setSlide(Number(tab.dataset.slide))));
  let slide = 0;
  setSlide(slide);
  window.setInterval(() => { slide = (slide + 1) % tabs.length; setSlide(slide); }, 6000);

  propertyTabs.forEach((tab) => tab.addEventListener('click', () => {
    propertyTabs.forEach((item) => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.property-card').forEach((card, index) => {
      card.style.opacity = tab.dataset.category === 'Land' && index === 0 ? '.45' : '1';
    });
  }));

  window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => nav?.classList.remove('is-open')));
  document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button');
    button.textContent = 'Message sent ✓';
    button.disabled = true;
  });
})();
