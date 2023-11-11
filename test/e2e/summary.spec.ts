import {expect, test} from '@playwright/test'

test('should be able to see 5 star characters summary page', async ({page}) => {
    await page.goto('/5star/characters/summary')
    await expect(page.getByText('Venti')).toBeVisible()
})
