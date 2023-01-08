import {expect, test} from '@playwright/test'

test('should be able to add rotations', async ({page}) => {
    await page.goto('/artifacts/manage')
    await page.evaluate(() => window.localStorage.clear());
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload();

    await expect(page.getByText('#1')).not.toBeVisible();
    await page.getByText('New Rotation').click()
    await page.getByText('Ridge Watch').click()
    await page.getByText('Create #1').click()

    await expect(page.getByText('Ridge Watch')).toBeVisible();
    await expect(page.getByText('Day 1 of 7')).toBeVisible();

    await page.getByText('New Rotation').click()
    await expect(page.getByText('You must select a domain first')).not.toBeVisible()
    await page.locator('button', {hasText: 'Create'}).click()
    await expect(page.getByText('You must select a domain first')).toBeVisible()
    await page.getByText('Domain of Guyun').click()
    await page.locator('button', {hasText: 'Create'}).click()
    await page.getByText('Insert as #2').click()

    await expect(page.getByText('Ridge Watch')).toBeVisible();
    await expect(page.getByText('Day 1 of 7')).toBeVisible();
    await expect(page.getByText('Domain of Guyun')).toBeVisible();
    await expect(page.getByText('7 Days of Rotation')).toBeVisible();
})