import { test, expect } from '@playwright/test';

// Add a patient, go to home page and search for patient, assert all fields are correct
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('Enter username').click();
  await page.getByPlaceholder('Enter username').fill('admin');
  await page.getByPlaceholder('Enter username').press('Tab');
  await page.getByPlaceholder('Enter password').fill('admin');
  await page.getByPlaceholder('Enter password').press('Enter');
  await page.getByRole('link', { name: 'Add Patient' }).click();
  await page.getByPlaceholder('Name', { exact: true }).click();
  await page.getByPlaceholder('Name', { exact: true }).fill('New Patient\'s Name');
  await page.getByPlaceholder('Name', { exact: true }).press('Tab');
  await page.getByPlaceholder('Khmer Name').fill('កហមេរ នាមេ ហេរេរ');
  await page.locator('input[type="date"]').first().fill('2000-06-14');
  await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').selectOption('F');
  await page.getByPlaceholder('Contact No.').click();
  await page.getByPlaceholder('Contact No.').fill('12345678');
  await page.locator('input[type="date"]').nth(1).fill('2024-06-14');
  await page.getByPlaceholder('Village').click();
  await page.getByPlaceholder('Village').fill('SR');
  await page.getByPlaceholder('Family Group').click();
  await page.getByPlaceholder('Family Group').fill('S01');
  await page.getByPlaceholder('Queue Number').click();
  await page.getByPlaceholder('Queue Number').fill('S01A');
  await page.getByRole('combobox').nth(1).selectOption('true');
  await page.locator('input[type="date"]').nth(2).fill('2024-06-14');
  await page.getByPlaceholder('Enter Drug Allergies').click();
  await page.getByPlaceholder('Enter Drug Allergies').fill('nil');
  await page.getByRole('combobox').nth(2).selectOption('false');
  await page.getByRole('button', { name: 'Save' }).click();

  // Navigate to AllPatients Page and get View / Edit Patients Page of created Patient
  await page.getByRole('link', { name: 'All Patients' }).click();
  await page.getByPlaceholder('Search by ID/Name/Khmer Name/DOB/Contact No.').click();
  await page.getByPlaceholder('Search by ID/Name/Khmer Name/DOB/Contact No.').fill('New Patient\'s Name');
  await page.getByRole('cell', { name: 'New Patient\'s Name' }).first().click();
  await page.locator('img').first().click();

  // Assert all fields correct
  expect(await page.getByPlaceholder('Name', { exact: true }).inputValue()).toBe('New Patient\'s Name');
  expect(await page.getByPlaceholder('Khmer Name').inputValue()).toBe('កហមេរ នាមេ ហេរេរ');
  expect(await page.locator('input[type="date"]').first().inputValue()).toBe('2000-06-14');
  expect(await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').inputValue()).toBe('F');
  expect(await page.getByPlaceholder('Contact No.').inputValue()).toBe('12345678');
  expect(await page.locator('input[type="date"]').nth(1).inputValue()).toBe('2024-06-14');
  expect(await page.getByPlaceholder('Village').inputValue()).toBe('SR');
  expect(await page.getByPlaceholder('Family Group').inputValue()).toBe('S01');
  expect(await page.getByPlaceholder('Queue Number').inputValue()).toBe('S01A');
  expect(await page.getByRole('combobox').nth(1).inputValue()).toBe('true');
  expect(await page.locator('input[type="date"]').nth(2).inputValue()).toBe('2024-06-14');
  expect(await page.getByPlaceholder('Enter Drug Allergies').inputValue()).toBe('nil');
  expect(await page.getByRole('combobox').nth(2).inputValue()).toBe('false');
  await expect(page.getByRole('heading', { name: 'Name: New Patient\'s Name' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Age: 24' })).toBeVisible();  
});