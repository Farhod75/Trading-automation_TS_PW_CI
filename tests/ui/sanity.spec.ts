import { test, expect } from '../../src/utils/testBase';

test.describe('Sanity check', () => {
  test('Playwright setup is working', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example Domain/);
  });
});