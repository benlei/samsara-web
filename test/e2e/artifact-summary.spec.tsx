import { test, expect } from '@playwright/test'

test('should be able to sort', async ({ page }) => {
    // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
    await page.goto('/')
    await expect(page.getByText('Venti')).toBeVisible()
    await expect(page.getByText('Keqing')).not.toBeVisible()

    await page.getByText('Hide One-Offs').click()
    await expect(page.getByText('Venti')).toBeVisible()
    await expect(page.getByText('Keqing')).toBeVisible()
    await expect(page.locator('td').first()).toContainText('Keqing')

    await page.getByText('Descending').click()
    await expect(page.locator('tr').last().locator('td').first()).toContainText('Keqing')
})