import {expect, test} from '@playwright/test'

test('should be able to sort in summary page', async ({page}) => {
    await page.goto('/')
    await expect(page.getByText('Venti')).toBeVisible()
    await expect(page.getByText('Keqing')).not.toBeVisible()

    await page.getByText('Hide One-Offs').locator('visible=true').click()
    await expect(page.getByText('Venti')).toBeVisible()
    await expect(page.getByText('Keqing')).toBeVisible()
    await expect(page.locator('tr').first().locator('td').first()).toContainText('Keqing')

    await page.getByText('Ascending').locator('visible=true').click()
    await expect(page.locator('tr').last().locator('td').first()).toContainText('Keqing')
})
