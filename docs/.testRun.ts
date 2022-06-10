export { testRun }

import { page, run, fetchHtml, partRegex, urlBase } from '../libframe/test/setup'

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
    expect(html).toMatch(partRegex`<h2>${/[^\<]+/}Control</h2>`)
    expect(html).toContain('<h2>🔧<!-- --> Control</h2>')
  })

  test('Learn more collapsible', async () => {
    await page.goto(urlBase + '/')
    const learnMoreText = 'you keep control over how your pages are rendered'
    expect(await page.textContent('body')).not.toContain(learnMoreText)
    await page.locator('h2:has-text("Control")').click()
    expect(await page.textContent('body')).toContain(learnMoreText)
    await page.locator('h2:has-text("Control")').click()
    expect(await page.textContent('body')).not.toContain(learnMoreText)
  })
}
