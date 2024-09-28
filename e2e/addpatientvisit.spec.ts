import { test, expect } from '@playwright/test';

// Add a new visit, edit all fields

test('test', async ({ page }) => {
  // Go to View / Edit Patient Page of an existing patient
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('Enter username').click();
  await page.getByPlaceholder('Enter username').fill('admin');
  await page.getByPlaceholder('Enter username').press('Tab');
  await page.getByPlaceholder('Enter password').fill('admin');
  await page.getByPlaceholder('Enter password').press('Enter');
  await page.getByRole('cell', { name: 'Walter White' }).click();

  // Add New Visit for Existing Patient
  await page.getByRole('link', { name: 'Add New Visit' }).click();
  await page.getByPlaceholder('Name', { exact: true }).click();
  await page.getByPlaceholder('Name', { exact: true }).fill('Jesse Pinkman');
  await page.getByPlaceholder('Name', { exact: true }).press('Tab');
  await page.getByPlaceholder('Khmer Name').fill('ដសាដាដសាាដ');
  await page.locator('input[type="date"]').first().fill('2000-02-10');
  await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').selectOption('F');
  await page.getByPlaceholder('Contact No.').click();
  await page.getByPlaceholder('Contact No.').fill('12345678');
  await page.locator('input[type="date"]').nth(1).fill('1950-08-27');
  await page.getByPlaceholder('Queue Number').click();
  await page.getByPlaceholder('Queue Number').fill('D5');
  await page.getByPlaceholder('Village').click();
  await page.getByPlaceholder('Village').fill('S0056');
  await page.getByPlaceholder('Family Group').click();
  await page.getByPlaceholder('Family Group').fill('QWERTY');
  await page.getByRole('combobox').nth(1).selectOption('false');
  await page.getByPlaceholder('Enter Drug Allergies').click();
  await page.getByPlaceholder('Enter Drug Allergies').fill('test');
  await page.getByRole('combobox').nth(2).selectOption('false');

  // Toggle between visits and go back to created visit
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'More Visits' }).click();
  await page.getByRole('button', { name: '27-08-1950' }).click();

  // Update Past Medical History of visit
  await page.getByRole('link', { name: 'Past Medical History' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('input[name="tuberculosis"]').nth(1).check();
  await page.locator('input[name="diabetes"]').nth(1).check();
  await page.locator('input[name="hypertension"]').nth(1).check();
  await page.locator('input[name="hyperlipidemia"]').nth(1).check();
  await page.locator('input[name="chronic-joint-pains"]').nth(1).check();
  await page.locator('input[name="chronic-muscle-aches"]').nth(1).check();
  await page.locator('input[name="std"]').nth(1).check();
  await page.getByLabel('If Y to STD, specify:').click();
  await page.getByLabel('If Y to STD, specify:').fill('test');
  await page.getByLabel('Others:').click();
  await page.getByLabel('Others:').fill('none');
  await page.getByRole('button', { name: 'Save Edits' }).click();

  // Update Social History of visit
  await page.getByRole('link', { name: 'Social History' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('input[name="smoking-hist"]').nth(1).check();
  await page.locator('input[name="curr-smoking-hist"]').nth(1).check();
  await page.locator('input[name="alc-hist"]').nth(1).check();
  await page.getByRole('button', { name: 'Save Edits' }).click();

  // Update Vital Statistics of visit
  await page.getByRole('link', { name: 'Vital Statistics' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByPlaceholder('Degree Celsius').click({
    clickCount: 5
  });
  await page.getByPlaceholder('Degree Celsius').fill('30');
  await page.getByPlaceholder('mmHg').first().click();
  await page.getByPlaceholder('mmHg').first().click();
  await page.getByPlaceholder('mmHg').first().fill('30');
  await page.getByPlaceholder('mmHg').first().press('Tab');
  await page.getByPlaceholder('mmHg').nth(1).press('Tab');
  await page.getByPlaceholder('mmHg').nth(2).press('Tab');
  await page.getByPlaceholder('%').click();
  await page.getByPlaceholder('%').fill('30');
  await page.getByText('Temperature SpO2 Systolic BP1').click();
  await page.getByPlaceholder('mmHg').nth(1).click();
  await page.getByPlaceholder('mmHg').nth(1).fill('30');
  await page.getByPlaceholder('mmHg').nth(3).click();
  await page.getByPlaceholder('mmHg').nth(3).fill('30');
  await page.getByPlaceholder('mmHg').nth(2).click();
  await page.getByPlaceholder('mmHg').nth(2).fill('30');
  await page.getByPlaceholder('BPM').first().click();
  await page.getByPlaceholder('BPM').first().fill('30');
  await page.getByPlaceholder('BPM').nth(1).click();
  await page.getByPlaceholder('BPM').nth(1).fill('30');
  await page.getByPlaceholder('mmol/L').click();
  await page.getByPlaceholder('mmol/L').fill('30');
  await page.getByPlaceholder('mg/dL').click();
  await page.getByPlaceholder('mg/dL').fill('30');
  await page.getByRole('button', { name: 'Save Edits' }).click();

  // Update Height and Weight of visit
  await page.getByRole('link', { name: 'Height and Weight' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByPlaceholder('cm').click();
  await page.getByPlaceholder('cm').fill('30');
  await page.getByPlaceholder('kg').click();
  await page.getByPlaceholder('kg').fill('30');
  await page.getByRole('spinbutton').nth(2).click();
  await page.getByRole('spinbutton').nth(2).fill('30');
  await page.getByRole('spinbutton').nth(3).click();
  await page.getByRole('spinbutton').nth(3).fill('30');
  await page.getByRole('button', { name: 'Save Edits' }).click();

  // Update Visual Acuity of visit
  await page.getByRole('link', { name: 'Visual Acuity' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('spinbutton').first().click();
  await page.getByRole('spinbutton').first().fill('40');
  await page.getByRole('spinbutton').nth(1).click();
  await page.getByRole('spinbutton').nth(1).fill('40');
  await page.getByPlaceholder('Remarks').click();
  await page.getByPlaceholder('Remarks').fill('40');
  await page.getByRole('button', { name: 'Save Edits' }).click();

  // Update Doctor's Consultation of visit
  await page.getByRole('link', { name: 'Doctor\'s Consult' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('div:nth-child(4) > div > div:nth-child(2)').click();
  await page.locator('input[name="msk"]').first().check();
  await page.locator('input[name="healthy"]').first().check();
  await page.locator('input[name="cvs"]').first().check();
  await page.locator('input[name="respi"]').first().check();
  await page.locator('input[name="gu"]').first().check();
  await page.locator('input[name="git"]').first().check();
  await page.locator('input[name="eye"]').first().check();
  await page.locator('input[name="derm"]').first().check();
  await page.getByPlaceholder('Specify').click();
  await page.getByPlaceholder('Specify').fill('none');
  await page.locator('div').filter({ hasText: /^Consultation Notes$/ }).getByPlaceholder('Remarks').click();
  await page.locator('div').filter({ hasText: /^Consultation Notes$/ }).getByPlaceholder('Remarks').fill('none');
  await page.locator('div').filter({ hasText: /^Diagnosis$/ }).getByPlaceholder('Remarks').click();
  await page.locator('div').filter({ hasText: /^Diagnosis$/ }).getByPlaceholder('Remarks').fill('none');
  await page.locator('div').filter({ hasText: /^Treatment$/ }).getByPlaceholder('Remarks').click();
  await page.locator('div').filter({ hasText: /^Treatment$/ }).getByPlaceholder('Remarks').fill('none');
  await page.locator('input[name="ref-needed"]').nth(1).check();
  await page.getByRole('button', { name: 'Save Edits' }).click();

  // Navigate to Admin Modal and assert all fields correct
  await page.getByRole('link', { name: 'Admin' }).click();
  expect(await page.getByPlaceholder('Name', { exact: true }).inputValue()).toBe('Jesse Pinkman');
  expect(await page.getByPlaceholder('Khmer Name').inputValue()).toBe('ដសាដាដសាាដ');
  expect(await page.locator('input[type="date"]').first().inputValue()).toBe('2000-02-10');
  expect(await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').inputValue()).toBe('F');
  expect(await page.getByPlaceholder('Contact No.').inputValue()).toBe('12345678');
  expect(await page.locator('input[type="date"]').nth(1).inputValue()).toBe('1950-08-27');
  expect(await page.getByPlaceholder('Queue Number').inputValue()).toBe('D5');
  expect(await page.getByPlaceholder('Village').inputValue()).toBe('S0056');
  expect(await page.getByPlaceholder('Family Group').inputValue()).toBe('QWERTY');
  expect(await page.getByRole('combobox').nth(1).inputValue()).toBe('false');
  expect(await page.getByPlaceholder('Enter Drug Allergies').inputValue()).toBe('test');
  expect(await page.getByRole('combobox').nth(2).inputValue()).toBe('false');
  await expect(page.getByRole('heading', { name: 'Name: Jesse Pinkman' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Age: 24' })).toBeVisible();

  // Assert Past Medical History correct
  await page.getByRole('link', { name: 'Past Medical History' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  expect(await page.locator('input[name="tuberculosis"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="diabetes"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="hypertension"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="hyperlipidemia"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="chronic-joint-pains"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="chronic-muscle-aches"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="std"]').nth(1).isChecked()).toBe(true);
  expect(await page.getByLabel('If Y to STD, specify:').inputValue()).toBe('test');
  expect(await page.getByLabel('Others:').inputValue()).toBe('none');

  // Assert Social History correct
  await page.getByRole('link', { name: 'Social History' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  expect(await page.locator('input[name="smoking-hist"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="curr-smoking-hist"]').nth(1).isChecked()).toBe(true);
  expect(await page.locator('input[name="alc-hist"]').nth(1).isChecked()).toBe(true);

  // Assert Vital Statistics correct
  await page.getByRole('link', { name: 'Vital Statistics' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  expect(await page.getByPlaceholder('Degree Celsius').inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mmHg').first().inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mmHg').nth(1).inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mmHg').nth(2).inputValue()).toBe('30');
  expect(await page.getByPlaceholder('%').inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mmHg').nth(3).inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mmHg').nth(1).inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mmHg').nth(3).inputValue()).toBe('30');
  expect(await page.getByPlaceholder('BPM').first().inputValue()).toBe('30');
  expect(await page.getByPlaceholder('BPM').nth(1).inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mmol/L').inputValue()).toBe('30');
  expect(await page.getByPlaceholder('mg/dL').inputValue()).toBe('30');

  // Assert Height and Weight correct
  await page.getByRole('link', { name: 'Height and Weight' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  expect(await page.getByPlaceholder('cm').inputValue()).toBe('30');
  expect(await page.getByPlaceholder('kg').inputValue()).toBe('30');
  expect(await page.getByRole('spinbutton').nth(2).inputValue()).toBe('30');
  expect(await page.getByRole('spinbutton').nth(3).inputValue()).toBe('30');

  // Assert Visual Acuity correct
  await page.getByRole('link', { name: 'Visual Acuity' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  expect(await page.getByRole('spinbutton').first().inputValue()).toBe('40');
  expect(await page.getByRole('spinbutton').nth(1).inputValue()).toBe('40');
  expect(await page.getByPlaceholder('Remarks').inputValue()).toBe('40');

  // Assert Doctor's Consultation correct
  await page.getByRole('link', { name: 'Doctor\'s Consult' }).click();
  expect(await page.locator('input[name="msk"]').first().isChecked()).toBe(true);
  expect(await page.locator('input[name="healthy"]').first().isChecked()).toBe(true);
  expect(await page.locator('input[name="cvs"]').first().isChecked()).toBe(true);
  expect(await page.locator('input[name="respi"]').first().isChecked()).toBe(true);
  expect(await page.locator('input[name="gu"]').first().isChecked()).toBe(true);
  expect(await page.locator('input[name="git"]').first().isChecked()).toBe(true);
  expect(await page.locator('input[name="eye"]').first().isChecked()).toBe(true);
  expect(await page.locator('input[name="derm"]').first().isChecked()).toBe(true);
  expect(await page.getByPlaceholder('Specify').inputValue()).toBe('none');
  expect(await page.locator('input[name="ref-needed"]').nth(1).isChecked()).toBe(true);
});