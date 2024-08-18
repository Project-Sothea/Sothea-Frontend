import { test, expect } from '@playwright/test'

// Add a patient, Edit all Admin Modal fields assert all fields are correct
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.goto('http://localhost:5173/signin')
  await page.getByPlaceholder('Enter username').click()
  await page.getByPlaceholder('Enter username').fill('admin')
  await page.getByPlaceholder('Enter username').press('Tab')
  await page.getByPlaceholder('Enter password').fill('admin')
  await page.getByPlaceholder('Enter password').press('Enter')
  await page.getByRole('link', { name: 'Add Patient' }).click()
  await page.getByPlaceholder('Name', { exact: true }).click()
  await page.getByPlaceholder('Name', { exact: true }).fill("New Patient's Name")
  await page.getByPlaceholder('Name', { exact: true }).press('Tab')
  await page.getByPlaceholder('Khmer Name').fill('កហមេរ នាមេ ហេរេរ')
  await page.locator('input[type="date"]').first().fill('2000-06-14')
  await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').selectOption('F')
  await page.getByPlaceholder('Contact No.').click()
  await page.getByPlaceholder('Contact No.').fill('12345678')
  await page.locator('input[type="date"]').nth(1).fill('2024-06-14')
  await page.getByPlaceholder('Village').click()
  await page.getByPlaceholder('Village').fill('SR')
  await page.getByPlaceholder('Queue Number').click();
  await page.getByPlaceholder('Queue Number').fill('2B');
  await page.getByPlaceholder('Family Group').click()
  await page.getByPlaceholder('Family Group').fill('S01')
  await page.getByRole('combobox').nth(1).selectOption('true')
  await page.locator('input[type="date"]').nth(2).fill('2024-06-14')
  await page.getByPlaceholder('Enter Drug Allergies').click()
  await page.getByPlaceholder('Enter Drug Allergies').fill('nil')
  await page.getByRole('combobox').nth(2).selectOption('false')
  await page.getByRole('button', { name: 'Save' }).click()

  // Wait for 1 second before performing edits
  await page.waitForTimeout(1000)

  // Edit all Admin Modal fields
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByPlaceholder('Name', { exact: true }).click()
  await page.getByPlaceholder('Name', { exact: true }).press('ControlOrMeta+a')
  await page.getByPlaceholder('Name', { exact: true }).fill("Edited Patient's Name")
  await page.getByPlaceholder('Khmer Name').click()
  await page.getByPlaceholder('Khmer Name').press('ControlOrMeta+a')
  await page.getByPlaceholder('Khmer Name').fill('្ិេឹឆោេ្ឆិោេឆោ្ិិេ្ឆោេ្ឆិោឹេ្ោិេ្ោឆ្េ')
  await page.locator('input[type="date"]').first().fill('1982-02-14')
  await page.getByPlaceholder('Contact No.').click()
  await page.getByPlaceholder('Contact No.').press('ControlOrMeta+a')
  await page.getByPlaceholder('Contact No.').fill('902193200193')
  await page.locator('input[type="date"]').nth(1).fill('2024-06-18')
  await page.getByPlaceholder('Village').click()
  await page.getByPlaceholder('Village').fill('QWERTY')
  await page.getByPlaceholder('Queue Number').click();
  await page.getByPlaceholder('Queue Number').fill('5D');
  await page.getByPlaceholder('Family Group').click()
  await page.getByPlaceholder('Family Group').fill('S02')
  await page.getByRole('combobox').nth(1).selectOption('false')
  await page.locator('input[type="date"]').nth(2).fill('2024-06-08')
  await page.locator('div:nth-child(6) > div').first().click()
  await page.getByPlaceholder('Enter Drug Allergies').fill('Aspirin')
  await page.getByRole('combobox').nth(2).selectOption('true')
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Wait for 1 second before performing assertions
  await page.waitForTimeout(1000)

  // Assert all fields correct
  expect(await page.getByPlaceholder('Name', { exact: true }).inputValue()).toBe(
    "Edited Patient's Name"
  )
  expect(await page.getByPlaceholder('Khmer Name').inputValue()).toBe(
    '្ិេឹឆោេ្ឆិោេឆោ្ិិេ្ឆោេ្ឆិោឹេ្ោិេ្ោឆ្េ'
  )
  expect(await page.locator('input[type="date"]').first().inputValue()).toBe('1982-02-14')
  expect(
    await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').inputValue()
  ).toBe('F')
  expect(await page.getByPlaceholder('Contact No.').inputValue()).toBe('902193200193')
  expect(await page.locator('input[type="date"]').nth(1).inputValue()).toBe('2024-06-18')
  expect(await page.getByPlaceholder('Village').inputValue()).toBe('QWERTY')
  expect(await page.getByPlaceholder('Family Group').inputValue()).toBe('S02')
  expect(await page.getByPlaceholder('Queue Number').inputValue()).toBe('5D')
  expect(await page.getByRole('combobox').nth(1).inputValue()).toBe('false')
  expect(await page.locator('input[type="date"]').nth(2).inputValue()).toBe('2024-06-08')
  expect(await page.getByPlaceholder('Enter Drug Allergies').inputValue()).toBe('Aspirin');
  expect(await page.getByRole('combobox').nth(2).inputValue()).toBe('true')
  await expect(page.getByRole('heading', { name: "Name: Edited Patient's Name" })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Age: 42' })).toBeVisible()
})
