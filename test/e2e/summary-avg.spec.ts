import {expect, test} from '@playwright/test'

test('should be able to see 5 star characters summary avg page', async ({page}) => {
    await page.goto('/5star/characters/summary-avg')
    await expect(page.getByText('Venti')).toBeVisible()
    // await expect(page.getByText('Keqing')).not.toBeVisible()
})