import { DrugInfo, DrugInteraction } from './types';

export const demoMedicines: DrugInfo[] = [
  {
    id: 'demo-1',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic acid',
    brandNames: ['Bayer', 'Ecotrin', 'Bufferin'],
    usage: 'Used to reduce pain, fever, or inflammation. Also used to prevent blood clots in patients at risk for heart attack or stroke.',
    warnings: [
      'Do not use if allergic to NSAIDs',
      'May cause stomach bleeding',
      'Not recommended for children under 12 with viral infections'
    ],
    precautions: [
      'Take with food to reduce stomach upset',
      'Avoid alcohol while taking this medication',
      'Inform your doctor if you have asthma or bleeding disorders'
    ],
    commonSideEffects: ['Stomach upset', 'Heartburn', 'Nausea'],
    seriousSideEffects: ['Black or bloody stools', 'Severe stomach pain', 'Ringing in ears'],
    isDemo: true
  },
  {
    id: 'demo-2',
    name: 'Metformin',
    genericName: 'Metformin hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza'],
    usage: 'Used to control high blood sugar in people with type 2 diabetes. Helps improve insulin sensitivity and reduce glucose production.',
    warnings: [
      'May cause lactic acidosis (rare but serious)',
      'Do not use if you have severe kidney problems',
      'Stop before any surgery or medical procedures with contrast dye'
    ],
    precautions: [
      'Take with meals to reduce stomach upset',
      'Monitor blood sugar levels regularly',
      'Stay well hydrated'
    ],
    commonSideEffects: ['Diarrhea', 'Nausea', 'Stomach discomfort', 'Metallic taste'],
    seriousSideEffects: ['Lactic acidosis symptoms', 'Severe weakness', 'Unusual muscle pain'],
    isDemo: true
  },
  {
    id: 'demo-3',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Zestril', 'Prinivil', 'Qbrelis'],
    usage: 'Used to treat high blood pressure (hypertension) and heart failure. Helps relax blood vessels to improve blood flow.',
    warnings: [
      'Do not use if pregnant',
      'May cause angioedema (severe swelling)',
      'Can cause high potassium levels'
    ],
    precautions: [
      'Avoid potassium supplements unless directed',
      'Stay hydrated but avoid excessive salt',
      'Monitor kidney function regularly'
    ],
    commonSideEffects: ['Dry cough', 'Dizziness', 'Headache', 'Fatigue'],
    seriousSideEffects: ['Swelling of face/lips/tongue', 'Difficulty breathing', 'Chest pain'],
    isDemo: true
  },
  {
    id: 'demo-4',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin calcium',
    brandNames: ['Lipitor', 'Atorvaliq'],
    usage: 'Used to lower cholesterol and reduce the risk of heart disease. Helps reduce LDL (bad) cholesterol and increase HDL (good) cholesterol.',
    warnings: [
      'May cause liver problems',
      'Report any unexplained muscle pain',
      'Not recommended during pregnancy'
    ],
    precautions: [
      'Avoid grapefruit juice',
      'Regular liver function tests recommended',
      'Maintain a healthy diet and exercise'
    ],
    commonSideEffects: ['Muscle aches', 'Joint pain', 'Diarrhea', 'Nausea'],
    seriousSideEffects: ['Severe muscle pain', 'Dark urine', 'Yellowing skin/eyes'],
    isDemo: true
  },
  {
    id: 'demo-5',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Losec', 'Zegerid'],
    usage: 'Used to treat gastroesophageal reflux disease (GERD), stomach ulcers, and conditions that cause excess stomach acid.',
    warnings: [
      'Long-term use may increase risk of bone fractures',
      'May cause vitamin B12 deficiency',
      'Can mask symptoms of stomach cancer'
    ],
    precautions: [
      'Take before meals',
      'Do not crush or chew extended-release capsules',
      'Inform doctor of long-term use'
    ],
    commonSideEffects: ['Headache', 'Stomach pain', 'Nausea', 'Diarrhea'],
    seriousSideEffects: ['Severe diarrhea', 'Bone pain', 'Seizures'],
    isDemo: true
  },
  {
    id: 'demo-6',
    name: 'Amlodipine',
    genericName: 'Amlodipine besylate',
    brandNames: ['Norvasc', 'Katerzia'],
    usage: 'Used to treat high blood pressure and chest pain (angina). Helps relax blood vessels so blood can flow more easily.',
    warnings: [
      'May worsen chest pain initially',
      'Do not stop suddenly',
      'Use with caution in liver disease'
    ],
    precautions: [
      'Avoid grapefruit products',
      'Rise slowly to prevent dizziness',
      'Monitor blood pressure regularly'
    ],
    commonSideEffects: ['Swelling of ankles', 'Dizziness', 'Flushing', 'Fatigue'],
    seriousSideEffects: ['Irregular heartbeat', 'Severe dizziness', 'Fainting'],
    isDemo: true
  }
];

export const demoInteractions: DrugInteraction[] = [
  {
    id: 'int-1',
    drug1: 'Aspirin',
    drug2: 'Lisinopril',
    severity: 'moderate',
    description: 'Aspirin may reduce the blood pressure-lowering effect of Lisinopril. Regular use of aspirin can decrease the effectiveness of ACE inhibitors.',
    recommendation: 'Monitor blood pressure closely. Consider using low-dose aspirin (81mg) if both are needed. Consult your doctor.'
  },
  {
    id: 'int-2',
    drug1: 'Metformin',
    drug2: 'Lisinopril',
    severity: 'mild',
    description: 'When used together, there may be an increased risk of low blood sugar (hypoglycemia). Both medications can affect blood sugar levels.',
    recommendation: 'Monitor blood sugar levels more frequently. This combination is generally safe but requires monitoring.'
  },
  {
    id: 'int-3',
    drug1: 'Aspirin',
    drug2: 'Atorvastatin',
    severity: 'mild',
    description: 'Low-dose aspirin and statins are often prescribed together for cardiovascular protection. Minor interaction risk.',
    recommendation: 'Generally safe combination. Monitor for any unusual bleeding or muscle pain.'
  },
  {
    id: 'int-4',
    drug1: 'Omeprazole',
    drug2: 'Metformin',
    severity: 'moderate',
    description: 'Omeprazole may increase metformin levels in the blood by affecting its absorption and elimination.',
    recommendation: 'Monitor blood sugar levels. Consider alternative acid-reducing medications if needed.'
  },
  {
    id: 'int-5',
    drug1: 'Amlodipine',
    drug2: 'Atorvastatin',
    severity: 'moderate',
    description: 'Amlodipine may increase atorvastatin blood levels, potentially increasing the risk of side effects including muscle problems.',
    recommendation: 'Limit atorvastatin dose to 20mg daily when used with amlodipine. Monitor for muscle pain.'
  },
  {
    id: 'int-6',
    drug1: 'Aspirin',
    drug2: 'Omeprazole',
    severity: 'mild',
    description: 'Omeprazole may slightly reduce the antiplatelet effect of aspirin. However, it also protects against aspirin-related stomach issues.',
    recommendation: 'Benefits often outweigh risks. Take aspirin and omeprazole at different times if possible.'
  },
  {
    id: 'int-7',
    drug1: 'Lisinopril',
    drug2: 'Amlodipine',
    severity: 'mild',
    description: 'Both medications lower blood pressure. When combined, the blood pressure-lowering effect is enhanced.',
    recommendation: 'This is often an intentional combination for better blood pressure control. Monitor for signs of low blood pressure.'
  },
  {
    id: 'int-8',
    drug1: 'Metformin',
    drug2: 'Aspirin',
    severity: 'mild',
    description: 'Aspirin may enhance the blood sugar-lowering effect of metformin in some cases.',
    recommendation: 'Monitor blood sugar levels. This combination is generally safe for cardiovascular protection in diabetic patients.'
  }
];

export const findInteractions = (medications: string[]): DrugInteraction[] => {
  const normalizedMeds = medications.map(m => m.toLowerCase());
  
  return demoInteractions.filter(interaction => {
    const drug1Lower = interaction.drug1.toLowerCase();
    const drug2Lower = interaction.drug2.toLowerCase();
    
    return normalizedMeds.some(med => med.includes(drug1Lower) || drug1Lower.includes(med)) &&
           normalizedMeds.some(med => med.includes(drug2Lower) || drug2Lower.includes(med));
  });
};
