import {expect, test} from '@playwright/test'

test('should be able to see resin page with military time', async ({page}) => {
    await page.goto('/resin')

    await expect(page.locator('tr', {
        has: page.getByText('Today')
    }).last().locator('td').last()).toContainText('M')

    await page.getByText('24 Hour Time').click()
    await expect(page.locator('tr', {
        has: page.getByText('Today')
    }).last().locator('td').last()).not.toContainText('M')
})