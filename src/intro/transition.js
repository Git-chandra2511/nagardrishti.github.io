import { gsap } from 'gsap'

export function playIntroExit({ overlay, model, ui, onComplete }) {
  const timeline = gsap.timeline({ onComplete })
  const exitScale = model.scale.x * 1.45
  timeline
    .to(ui, { duration: 0.25, opacity: 0, y: -14, stagger: 0.03, ease: 'power2.in' })
    .to(model.scale, { duration: 0.9, x: exitScale, y: exitScale, z: exitScale, ease: 'power3.in' }, '<')
    .to(model.position, { duration: 0.9, z: 1.3, ease: 'power3.in' }, '<')
    .to(overlay, { duration: 0.65, opacity: 0, ease: 'power2.inOut' }, '-=0.25')
  return timeline
}
