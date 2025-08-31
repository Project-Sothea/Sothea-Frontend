export default interface Physiotherapy {
  id?: number;
  patientId?: number; 
  painStiffnessDay: 0 | 1 | 2 | 3 | 4 | 5; // Pain/stiffness level during the day (0-5)
  painStiffnessNight: 0 | 1 | 2 | 3 | 4 | 5; // Pain/stiffness level during the night (0-5)
  symptomsInterfereTasks: 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always'; // How symptoms interfere with tasks
  symptomsChange: 'Improved' | 'Worsened' | 'Stayed the same'; // Symptoms change status
  symptomsNeedHelp: 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always'; // How often help is needed
  troubleSleepSymptoms: 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always'; // Trouble sleeping due to symptoms
  howMuchFatigue: 0 | 1 | 2 | 3 | 4 | 5; // Fatigue level (0-5)
  anxiousLowMood: 0 | 1 | 2 | 3 | 4 | 5; // Anxiety/low mood level (0-5)
  medicationManageSymptoms: 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always'; // Medication use frequency
}
