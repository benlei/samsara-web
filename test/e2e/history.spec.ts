import {expect, test} from '@playwright/test'

test('should be able to see history page', async ({page}) => {
    await page.goto('/5star/characters')
    expect(await page.$$("text='3.0'")).toHaveLength(2)
    expect(await page.$$("text='35'")).not.toHaveLength(0)
})