export default interface VitalStatistics {
  id?: number
  vid?: number
  /** Body temperature in degrees Celsius */
  temperature: number
  /** Blood oxygen saturation (SpO2) as a percentage */
  spo2: number
  /** First systolic blood pressure reading (mmHg) */
  systolicBp1: number | null
  /** First diastolic blood pressure reading (mmHg) */
  diastolicBp1: number | null
  /** Second systolic blood pressure reading (mmHg) */
  systolicBp2: number | null
  /** Second diastolic blood pressure reading (mmHg) */
  diastolicBp2: number | null
  /** Average of systolicBp1 and systolicBp2 */
  averageSystolicBP: number | null
  /** Average of diastolicBp1 and diastolicBp2 */
  averageDiastolicBP: number | null
  /** First heart rate reading (bpm) */
  hr1: number
  /** Second heart rate reading (bpm) */
  hr2: number
  /** Average of hr1 and hr2 */
  averageHR: number
  /** Random blood glucose level (mmol/L) */
  randBloodGlucoseMmolL: number | null
  /** ICOPE flag: patient flagged for high blood pressure follow-up */
  icopeHighBp: boolean | null
}
