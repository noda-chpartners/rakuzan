import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector<HTMLElement>('[data-header]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menuLinks = document.querySelectorAll<HTMLAnchorElement>('[data-menu-link]');

const lenis = new Lenis({
  duration: 1.15,
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const closeMenu = () => {
  if (!header || !menu || !toggle) return;
  header.classList.remove('is-open');
  menu.classList.remove('is-open');
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-locked');
  lenis.start();
};

const openMenu = () => {
  if (!header || !menu || !toggle) return;
  header.classList.add('is-open');
  menu.hidden = false;
  menu.classList.add('is-open');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('is-locked');
  lenis.stop();
};

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  if (expanded) closeMenu();
  else openMenu();
});

menuLinks.forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-slide]'));
const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-hero-dot]'));
let current = 0;
let timer: number | undefined;

const goTo = (index: number) => {
  if (!slides.length) return;
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
};

const play = () => {
  window.clearInterval(timer);
  if (reduceMotion || slides.length < 2) return;
  timer = window.setInterval(() => goTo(current + 1), 6200);
};

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goTo(i);
    play();
  });
});

play();

if (!reduceMotion) {
  gsap.from('.hero__content > *', {
    y: 28,
    opacity: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.15,
  });

  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      },
    );
  });

  const refresh = () => ScrollTrigger.refresh();
  requestAnimationFrame(refresh);
  window.addEventListener('load', refresh);
} else {
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('is-visible');
    (el as HTMLElement).style.opacity = '1';
    (el as HTMLElement).style.transform = 'none';
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: -24 });
  });
});
