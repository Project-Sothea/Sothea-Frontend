import { test, expect } from '@playwright/test'

// Add a new patient, Edit all Admin Modal fields for this visit, then assert all fields are correct
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.goto('http://localhost:5173/signin')
  await page.getByPlaceholder('Enter username').click()
  await page.getByPlaceholder('Enter username').fill('admin')
  await page.getByPlaceholder('Enter username').press('Tab')
  await page.getByPlaceholder('Enter password').fill('admin')
  await page.getByPlaceholder('Enter password').press('Enter')
  await page.getByRole('link', { name: 'Add Patient' }).click()

  // Add a patient
  await page.getByPlaceholder('Name', { exact: true }).click()
  await page.getByPlaceholder('Name', { exact: true }).fill('Khay Veata')
  await page.getByPlaceholder('Name', { exact: true }).press('Tab')
  await page.getByPlaceholder('Khmer Name').fill('កហមេរ នាមេ ហេរេរ')
  await page.locator('input[type="date"]').first().fill('2000-06-14')
  await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').selectOption('F')
  await page.getByPlaceholder('Contact No.').click()
  await page.getByPlaceholder('Contact No.').fill('12345678')
  await page.locator('input[type="date"]').nth(1).fill('2024-06-14')
  await page.getByPlaceholder('Village').click()
  await page.getByPlaceholder('Village').fill('SR')
  await page.getByPlaceholder('Queue Number').click()
  await page.getByPlaceholder('Queue Number').fill('9A')
  await page.getByPlaceholder('Family Group').click()
  await page.getByPlaceholder('Family Group').fill('S01')
  await page.getByRole('combobox').nth(1).selectOption('true')
  await page.locator('input[type="date"]').nth(2).fill('2024-06-14')
  await page.getByPlaceholder('Enter Drug Allergies').click()
  await page.getByPlaceholder('Enter Drug Allergies').fill('')
  await page.getByRole('combobox').nth(2).selectOption('false')
  await page.getByRole('button', { name: 'Save' }).click()

  // Wait for 1 second before performing assertions
  await page.waitForTimeout(1000)

  // Edit all PastMedicalHistory Modal fields
  await page.getByRole('link', { name: 'Past Medical History' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.locator('input[name="tuberculosis"]').first().check()
  await page.locator('input[name="diabetes"]').first().check()
  await page.locator('input[name="hypertension"]').first().check()
  await page.locator('input[name="hyperlipidemia"]').first().check()
  await page.locator('input[name="chronic-joint-pains"]').nth(1).check()
  await page.locator('div:nth-child(9) > div > div:nth-child(3)').click()
  await page.locator('input[name="chronic-muscle-aches"]').nth(1).check()
  await page.locator('input[name="std"]').nth(1).check()
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Edit all Social History Modal fields
  await page.getByRole('link', { name: 'Social History' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.locator('input[name="smoking-hist"]').nth(1).check()
  await page.locator('input[name="curr-smoking-hist"]').nth(1).check()
  await page.locator('input[name="alc-hist"]').nth(1).check()
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Edit all VitalStatistics Modal fields
  await page.getByRole('link', { name: 'Vital Statistics' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByPlaceholder('Degree Celsius').click()
  await page.getByPlaceholder('Degree Celsius').fill('36.1')
  await page.getByPlaceholder('%').click()
  await page.getByPlaceholder('%').fill('95')
  await page.getByPlaceholder('mmHg').first().click()
  await page.getByPlaceholder('mmHg').first().fill('115')
  await page.getByPlaceholder('mmHg').nth(1).click()
  await page.getByPlaceholder('mmHg').nth(1).fill('115')
  await page.getByPlaceholder('mmHg').nth(2).click()
  await page.getByPlaceholder('mmHg').nth(2).fill('53')
  await page.getByPlaceholder('mmHg').nth(3).click()
  await page.getByPlaceholder('mmHg').nth(3).fill('93')
  await page.getByPlaceholder('BPM').first().click()
  await page.getByPlaceholder('BPM').first().fill('99')
  await page.getByPlaceholder('BPM').nth(1).click()
  await page.getByPlaceholder('BPM').nth(1).fill('87')
  await page.getByPlaceholder('mmol/L').click()
  await page.getByPlaceholder('mmol/L').fill('6.9')
  await page.getByPlaceholder('mg/dL').click()
  await page.getByPlaceholder('mg/dL').fill('124.2')
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Edit all HeightAndWeight Modal fields
  await page.getByRole('link', { name: 'Height and Weight' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByPlaceholder('cm').click()
  await page.getByPlaceholder('cm').fill('155.5')
  await page.getByPlaceholder('kg').click()
  await page.getByPlaceholder('kg').fill('52.9')
  await page.getByRole('spinbutton').nth(2).click()
  await page.getByRole('spinbutton').nth(2).fill('15')
  await page.getByRole('spinbutton').nth(3).click()
  await page.getByRole('spinbutton').nth(3).fill('50')
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Edit all VisualAcuity Modal fields
  await page.getByRole('link', { name: 'Visual Acuity' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByRole('spinbutton').first().click()
  await page.getByRole('spinbutton').first().fill('6')
  await page.getByRole('spinbutton').nth(1).click()
  await page.getByRole('spinbutton').nth(1).fill('6')
  await page.getByPlaceholder('Remarks').click()
  await page.getByPlaceholder('Remarks').fill('Pinhole: R not improved (cataract?); L 6/24')
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Edit all FallRisk Modal fields
  await page.getByRole('link', { name: 'Fall Risk' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.locator('input[name="pastYearFall"]').first().check()
  await page.locator('input[name="unsteadyStandingFalling"]').first().check()
  await page.locator('input[name="fallWorries"]').first().check()
  await page.getByPlaceholder('Others').click()
  await page.getByPlaceholder('Others').fill('Others here')
  await page.locator('input[name="furtherReferral"]').first().check()
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Edit all DoctorConsult Modal fields
  await page.getByRole('link', { name: "Doctor's Consult" }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.locator('input[name="healthy"]').nth(1).check()
  await page.locator('input[name="msk"]').nth(1).check()
  await page.getByText('CVS').click()
  await page.locator('input[name="cvs"]').first().check()
  await page.locator('input[name="respi"]').nth(1).check()
  await page.locator('input[name="gu"]').first().check()
  await page.locator('input[name="git"]').nth(1).check()
  await page.locator('input[name="eye"]').first().check()
  await page.locator('input[name="derm"]').nth(1).check()
  await page.getByPlaceholder('Specify').click()
  await page.getByPlaceholder('Specify').fill('H&N Pain')
  await page
    .locator('div')
    .filter({ hasText: /^Consultation Notes$/ })
    .getByPlaceholder('Remarks')
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^Consultation Notes$/ })
    .getByPlaceholder('Remarks')
    .fill('S001H.docx')
  await page
    .locator('div')
    .filter({ hasText: /^Diagnosis$/ })
    .getByPlaceholder('Remarks')
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^Diagnosis$/ })
    .getByPlaceholder('Remarks')
    .fill('Transient Headache')
  await page
    .locator('div')
    .filter({ hasText: /^Treatment$/ })
    .getByPlaceholder('Remarks')
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^Treatment$/ })
    .getByPlaceholder('Remarks')
    .fill('Paracetamol 30 tablets - 1 tablet 3x/day, 8h apart + Rest')
  await page.locator('input[name="ref-needed"]').nth(1).check()
  await page.getByPlaceholder('Enter Location').click()
  await page.getByPlaceholder('Enter Location').fill('Location here')
  await page.getByRole('button', { name: 'Save Edits' }).click()

  // Wait for 1 second before performing assertions
  await page.waitForTimeout(1000)

  // Navigate to AllPatients Page and get View / Edit Patients Page of created Patient
  await page.getByRole('link', { name: 'All Patients' }).click()
  await page.getByPlaceholder('Search by ID/Name/Khmer Name/DOB/Contact No.').click()
  await page.getByPlaceholder('Search by ID/Name/Khmer Name/DOB/Contact No.').fill('Khay Veata')
  await page.getByRole('cell', { name: 'Khay Veata' }).first().click()

  // Assert all AdminModal fields correct
  await page.getByRole('link', { name: 'Admin' }).click()
  expect(await page.getByPlaceholder('Name', { exact: true }).inputValue()).toBe('Khay Veata')
  expect(await page.getByPlaceholder('Khmer Name').inputValue()).toBe('កហមេរ នាមេ ហេរេរ')
  expect(await page.locator('input[type="date"]').first().inputValue()).toBe('2000-06-14')
  expect(
    await page.locator('div').filter({ hasText: /^MF$/ }).getByRole('combobox').inputValue()
  ).toBe('F')
  expect(await page.getByPlaceholder('Contact No.').inputValue()).toBe('12345678')
  expect(await page.locator('input[type="date"]').nth(1).inputValue()).toBe('2024-06-14')
  expect(await page.getByPlaceholder('Village').inputValue()).toBe('SR')
  expect(await page.getByPlaceholder('Queue Number').inputValue()).toBe('9A')
  expect(await page.getByPlaceholder('Family Group').inputValue()).toBe('S01')
  expect(await page.getByRole('combobox').nth(1).inputValue()).toBe('true')
  expect(await page.locator('input[type="date"]').nth(2).inputValue()).toBe('2024-06-14')
  expect(await page.getByPlaceholder('Enter Drug Allergies').inputValue()).toBe('')
  expect(await page.getByRole('combobox').nth(2).inputValue()).toBe('false')
  await expect(page.getByRole('heading', { name: "Name: Khay Veata" })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Age: 24' })).toBeVisible()

  // Assert all PastMedicalHistory Modal fields correct
  await page.getByRole('link', { name: 'Past Medical History' }).click()
  expect(await page.locator('input[name="tuberculosis"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="diabetes"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="hypertension"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="hyperlipidemia"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="chronic-joint-pains"]').nth(1).isChecked()).toBeTruthy()
  expect(page.locator('input[name="chronic-muscle-aches"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="chronic-muscle-aches"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="std"]').nth(1).isChecked()).toBeTruthy()

  // Assert all SocialHistory Modal fields correct
  await page.getByRole('link', { name: 'Social History' }).click()
  expect(await page.locator('input[name="smoking-hist"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="curr-smoking-hist"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="alc-hist"]').nth(1).isChecked()).toBeTruthy()

  // Assert all VitalStatistics Modal fields correct
  await page.getByRole('link', { name: 'Vital Statistics' }).click()
  expect(await page.getByPlaceholder('Degree Celsius').inputValue()).toBe('36.1')
  expect(await page.getByPlaceholder('%').inputValue()).toBe('95')
  expect(await page.getByPlaceholder('mmHg').first().inputValue()).toBe('115')
  expect(await page.getByPlaceholder('mmHg').nth(1).inputValue()).toBe('115')
  expect(await page.getByPlaceholder('mmHg').nth(2).inputValue()).toBe('53')

  // Assert all HeightAndWeight Modal fields correct
  await page.getByRole('link', { name: 'Height and Weight' }).click()
  expect(await page.getByPlaceholder('cm').inputValue()).toBe('155.5')
  expect(await page.getByPlaceholder('kg').inputValue()).toBe('52.9')
  expect(await page.getByRole('spinbutton').nth(2).inputValue()).toBe('15')
  expect(await page.getByRole('spinbutton').nth(3).inputValue()).toBe('50')

  // Assert all VisualAcuity Modal fields correct
  await page.getByRole('link', { name: 'Visual Acuity' }).click()
  expect(await page.getByRole('spinbutton').first().inputValue()).toBe('6')
  expect(await page.getByRole('spinbutton').nth(1).inputValue()).toBe('6')
  expect(await page.getByPlaceholder('Remarks').inputValue()).toBe(
    'Pinhole: R not improved (cataract?); L 6/24'
  )

  // Assert all FallRisk Modal fields correct
  await page.getByRole('link', { name: 'Fall Risk' }).click()
  expect(await page.locator('input[name="pastYearFall"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="unsteadyStandingFalling"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="fallWorries"]').first().isChecked()).toBeTruthy()
  expect(await page.getByPlaceholder('Others').inputValue()).toBe('Others here')
  expect(await page.locator('input[name="furtherReferral"]').first().isChecked()).toBeTruthy()

  // Assert all DoctorConsult Modal fields correct
  await page.getByRole('link', { name: "Doctor's Consult" }).click()
  expect(await page.locator('input[name="healthy"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="msk"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="cvs"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="respi"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="gu"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="git"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.locator('input[name="eye"]').first().isChecked()).toBeTruthy()
  expect(await page.locator('input[name="derm"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.getByPlaceholder('Specify').inputValue()).toBe('H&N Pain')
  expect(
    await page
      .locator('div')
      .filter({ hasText: /^Consultation Notes$/ })
      .getByPlaceholder('Remarks')
      .inputValue()
  ).toBe('S001H.docx')
  expect(
    await page
      .locator('div')
      .filter({ hasText: /^Diagnosis$/ })
      .getByPlaceholder('Remarks')
      .inputValue()
  ).toBe('Transient Headache')
  expect(
    await page
      .locator('div')
      .filter({ hasText: /^Treatment$/ })
      .getByPlaceholder('Remarks')
      .inputValue()
  ).toBe('Paracetamol 30 tablets - 1 tablet 3x/day, 8h apart + Rest')
  expect(await page.locator('input[name="ref-needed"]').nth(1).isChecked()).toBeTruthy()
  expect(await page.getByPlaceholder('Enter Location').inputValue()).toBe('Location here')
  await expect(page.getByRole('heading', { name: 'Name: Khay Veata' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Age: 24' })).toBeVisible()
})
