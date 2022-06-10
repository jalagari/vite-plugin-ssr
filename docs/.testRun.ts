export { testRun }

import { page, run, fetchHtml, partRegex, urlBase } from '../libframe/test/setup'
import assert from 'assert'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)

  /*
  const isPreview = cmd === 'pnpm run preview'
  const isDev = cmd === 'pnpm run dev'
  */

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain(
      '<meta name="description" content="Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin." />',
    )
    expect(html).toContain('integrate tools manually')
    expect(html).toMatch(partRegex`<h2>${/[^\/]+/}Control</h2>`)
    expect(html).toContain('<h2>🔧<!-- --> Control</h2>')
  })

  test('Learn more collapsible', async () => {
    await page.goto(urlBase + '/')
    // @ts-ignore
    await expect(page.locator('body')).toBeVisible()
    const text = 'you keep control over how your pages are rendered'
    const query = `p:has-text(${text})`
    const el = page.locator(query)
    // @ts-ignore
    await expect(el).not.toBeVisible()
    await page.locator('h2:has-text("Control")').click()
    // @ts-ignore
    await expect(el).toBeVisible()
    await page.locator('h2:has-text("Control")').click()
    // @ts-ignore
    await expect(el).not.toBeVisible()
  })

  test('Layout', async () => {
    const layout = await page.evaluate(() => {
      return {
        html: getWidths(document.documentElement),
        body: getWidths(document.body),
        page: getWidths(document.querySelector('#page-view')),
        left: getWidths(document.querySelector('#navigation-wrapper')),
        right: getWidths(document.querySelector('#page-wrapper')),
      }
      function getWidths(elem: Element | null): Widths {
        assert(elem)
        return {
          clientWidth: elem.clientWidth,
          scrollWidth: elem.scrollWidth,
        }
      }
    })

    // Default viewport size: 1280x720
    //  - https://playwright.dev/docs/api/class-testoptions#test-options-viewport
    testWidth(layout.html, 1280)
    testWidth(layout.body, 1280)
    testWidth(layout.page, 1280)
    testWidth(layout.left, 307)
    testWidth(layout.right, 973)

    return

    type Widths = {
      clientWidth: number
      scrollWidth: number
    }

    function testWidth(widths: Widths, width: number) {
      expect(widths.clientWidth).toBe(width)
      expect(widths.scrollWidth).toBe(width)
    }
  })
}
