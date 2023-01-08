import {expect, test} from '@playwright/test'

test('should be able to sort in history page', async ({page}) => {
    await page.goto('/5star/characters')
    await expect(page.getByText('Venti')).toBeVisible()
    await expect(page.getByText('Keqing')).not.toBeVisible()

    await page.getByText('Hide One-Offs').click()
    await expect(page.getByText('Venti')).toBeVisible()
    await expect(page.getByText('Keqing')).toBeVisible()

    const descendingRows = await page.locator('tr').all()
    await expect(descendingRows[descendingRows.length - 2].locator('td').first()).toContainText('Keqing')

    await page.getByText('Descending').click()
    const ascendingRows = await page.locator('tr').all()
    await expect(ascendingRows[1].locator('td').first()).toContainText('Keqing')
})