export function createInteraction(container, animation) {
  const onPointerMove = (event) => {
    const rect = container.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    animation.setPointerTarget(x, y)
  }
  const onPointerLeave = () => animation.setPointerTarget(0, 0)

  container.addEventListener('pointermove', onPointerMove)
  container.addEventListener('pointerleave', onPointerLeave)
  return () => {
    container.removeEventListener('pointermove', onPointerMove)
    container.removeEventListener('pointerleave', onPointerLeave)
  }
}
