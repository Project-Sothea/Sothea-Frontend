// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, type App } from 'vue'
import WarningIndicator from '../WarningIndicator.vue'

let app: App

afterEach(() => {
  app?.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function mountWarning(left = 200, top = 100) {
  const container = document.createElement('div')
  container.style.overflow = 'hidden'
  document.body.append(container)
  app = createApp({ render: () => h(WarningIndicator, { tooltip: 'Referral needed' }) })
  app.mount(container)
  const trigger = container.querySelector<HTMLElement>('[tabindex]')!
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
    return this === trigger
      ? ({ left, right: left + 20, top, height: 20, width: 20 } as DOMRect)
      : ({ width: 180, height: 40 } as DOMRect)
  })
  return { container, trigger, move: (value: number) => (top = value) }
}

async function flush() {
  await nextTick()
  await nextTick()
}

describe('warning tooltip', () => {
  it('escapes the clipping container and follows its icon when the sidebar scrolls', async () => {
    const { container, trigger, move } = mountWarning()
    trigger.dispatchEvent(new MouseEvent('mouseenter'))
    await flush()
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!
    expect(tooltip.parentElement).toBe(document.body)
    expect(container.contains(tooltip)).toBe(false)
    expect(tooltip.style.left).toBe('228px')
    expect(tooltip.style.top).toBe('90px')
    move(160)
    container.dispatchEvent(new Event('scroll'))
    await flush()
    expect(tooltip.style.top).toBe('150px')
    trigger.dispatchEvent(new MouseEvent('mouseleave'))
    await flush()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('supports keyboard focus, keeps the popup inside the viewport, and dismisses with Escape', async () => {
    const { trigger } = mountWarning(window.innerWidth - 40, 0)
    trigger.focus()
    await flush()
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!
    expect(tooltip.style.left).toBe(`${window.innerWidth - 228}px`)
    expect(tooltip.style.top).toBe('8px')
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flush()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })
})
