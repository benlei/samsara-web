import {expect, test} from '@playwright/test'
test('should be able to see 5 star characters shortest leaderboard page', async ({page}) => {
    await page.goto('/5star/characters/shortest-leaderboard')
    await expect(page.getByText('Venti')).toBeVisible()
})