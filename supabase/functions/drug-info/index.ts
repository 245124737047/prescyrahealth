import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo medicines database
const demoMedicines = [
  {
    id: 'demo-1',
    name: 'Dolo 650',
    genericName: 'Paracetamol 650 mg',
    brandNames: ['Dolo 650', 'Calpol', 'Crocin', 'Panadol'],
    category: 'Analgesic and Antipyretic',
    howItWorks: 'Paracetamol works by inhibiting cyclooxygenase (COX) enzymes in the central nervous system, reducing the production of prostaglandins that cause pain and fever. Unlike NSAIDs, it has minimal anti-inflammatory effects.',
    usage: 'Used for relief of mild to moderate pain (headache, toothache, muscle pain) and reduction of fever.',
    dosageGuidance: 'Adults: 500-1000 mg every 4-6 hours, maximum 4000 mg per day. Do not exceed recommended dose.',
    contraindications: ['Severe liver disease', 'Known hypersensitivity to paracetamol', 'Chronic alcohol use'],
    warnings: ['Do not exceed 4g daily', 'Liver damage risk with overdose', 'Avoid alcohol'],
    precautions: ['Consult doctor if symptoms persist beyond 3 days', 'Use with caution in liver or kidney impairment'],
    commonSideEffects: ['Nausea', 'Rash (rare)', 'Allergic reactions (rare)'],
    seriousSideEffects: ['Liver damage (with overdose)', 'Severe skin reactions (very rare)', 'Blood disorders (very rare)'],
    overdoseWarning: 'Paracetamol overdose can cause severe liver damage. Seek immediate medical attention if more than 4g taken in 24 hours. Early symptoms may include nausea, vomiting, and abdominal pain.',
    isDemo: true
  },
  {
    id: 'demo-2',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxil', 'Moxatag', 'Trimox'],
    category: 'Antibiotic (Penicillin)',
    howItWorks: 'Amoxicillin is a beta-lactam antibiotic that inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins.',
    usage: 'Treats bacterial infections including respiratory tract infections, ear infections, urinary tract infections, and skin infections.',
    dosageGuidance: 'Adults: 250-500 mg every 8 hours or 500-875 mg every 12 hours. Complete full course as prescribed.',
    contraindications: ['Penicillin allergy', 'Previous severe allergic reaction to any beta-lactam'],
    warnings: ['Complete full course of antibiotics', 'May cause allergic reactions', 'Can cause diarrhea'],
    precautions: ['Inform doctor of any allergies', 'May reduce effectiveness of oral contraceptives'],
    commonSideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Vomiting'],
    seriousSideEffects: ['Severe allergic reaction (anaphylaxis)', 'Clostridium difficile-associated diarrhea', 'Liver problems'],
    overdoseWarning: 'Overdose may cause nausea, vomiting, and diarrhea. Seek medical attention for severe symptoms.',
    isDemo: true
  },
  {
    id: 'demo-3',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Riomet'],
    category: 'Antidiabetic (Biguanide)',
    howItWorks: 'Metformin decreases glucose production in the liver, reduces intestinal glucose absorption, and improves insulin sensitivity.',
    usage: 'First-line treatment for type 2 diabetes mellitus to control blood sugar levels.',
    dosageGuidance: 'Adults: Start with 500 mg twice daily or 850 mg once daily, maximum 2550 mg/day in divided doses.',
    contraindications: ['Severe kidney disease', 'Metabolic acidosis', 'Diabetic ketoacidosis'],
    warnings: ['Risk of lactic acidosis', 'Stop before contrast procedures', 'Monitor kidney function'],
    precautions: ['Avoid excessive alcohol', 'Stay hydrated', 'Monitor blood glucose regularly'],
    commonSideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
    seriousSideEffects: ['Lactic acidosis (rare but serious)', 'Vitamin B12 deficiency', 'Hypoglycemia (when combined with other diabetes medicines)'],
    overdoseWarning: 'Overdose can cause lactic acidosis - symptoms include muscle pain, weakness, difficulty breathing. Seek emergency care immediately.',
    isDemo: true
  },
  {
    id: 'demo-4',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril', 'Qbrelis'],
    category: 'ACE Inhibitor (Antihypertensive)',
    howItWorks: 'Lisinopril blocks angiotensin-converting enzyme (ACE), preventing the conversion of angiotensin I to angiotensin II, leading to vasodilation and reduced blood pressure.',
    usage: 'Treatment of hypertension, heart failure, and to improve survival after heart attack.',
    dosageGuidance: 'Adults: Start with 5-10 mg once daily, maintenance dose typically 20-40 mg once daily.',
    contraindications: ['History of angioedema', 'Pregnancy', 'Bilateral renal artery stenosis'],
    warnings: ['Can cause severe allergic reactions', 'May cause high potassium levels', 'Avoid during pregnancy'],
    precautions: ['Monitor kidney function', 'Rise slowly to avoid dizziness', 'Avoid potassium supplements'],
    commonSideEffects: ['Dry cough', 'Dizziness', 'Headache', 'Fatigue'],
    seriousSideEffects: ['Angioedema (swelling of face/throat)', 'Kidney problems', 'High potassium levels'],
    overdoseWarning: 'Overdose can cause severe low blood pressure. Seek emergency care if experiencing fainting or extreme dizziness.',
    isDemo: true
  },
  {
    id: 'demo-5',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Losec', 'Omesec'],
    category: 'Proton Pump Inhibitor (PPI)',
    howItWorks: 'Omeprazole irreversibly blocks the hydrogen/potassium ATPase enzyme system (proton pump) in gastric parietal cells, reducing stomach acid production.',
    usage: 'Treatment of GERD, peptic ulcers, and conditions involving excess stomach acid.',
    dosageGuidance: 'Adults: 20-40 mg once daily, typically taken before breakfast for 4-8 weeks.',
    contraindications: ['Known hypersensitivity to PPIs', 'Concurrent use with rilpivirine'],
    warnings: ['Long-term use may increase fracture risk', 'May mask symptoms of gastric cancer', 'Can cause low magnesium'],
    precautions: ['Use lowest effective dose', 'Not for immediate heartburn relief', 'Review need for long-term use'],
    commonSideEffects: ['Headache', 'Abdominal pain', 'Nausea', 'Diarrhea'],
    seriousSideEffects: ['Clostridium difficile infection', 'Bone fractures', 'Vitamin B12 deficiency'],
    overdoseWarning: 'Overdose symptoms are usually mild including confusion, drowsiness, and nausea. Seek medical advice if concerned.',
    isDemo: true
  },
  {
    id: 'demo-6',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    brandNames: ['Lipitor', 'Torvast', 'Atorva'],
    category: 'Statin (HMG-CoA Reductase Inhibitor)',
    howItWorks: 'Atorvastatin inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis, reducing LDL cholesterol and triglycerides while increasing HDL cholesterol.',
    usage: 'Treatment of high cholesterol, prevention of cardiovascular disease in high-risk patients.',
    dosageGuidance: 'Adults: 10-80 mg once daily. Starting dose typically 10-20 mg, taken at any time of day.',
    contraindications: ['Active liver disease', 'Pregnancy and breastfeeding', 'Unexplained persistent elevated liver enzymes'],
    warnings: ['Report unexplained muscle pain immediately', 'Regular liver function monitoring needed', 'Avoid grapefruit juice'],
    precautions: ['Inform doctor of all medications', 'Women should use contraception', 'Limit alcohol intake'],
    commonSideEffects: ['Muscle pain', 'Joint pain', 'Diarrhea', 'Nausea'],
    seriousSideEffects: ['Rhabdomyolysis (severe muscle breakdown)', 'Liver damage', 'Memory problems'],
    overdoseWarning: 'No specific antidote exists. Seek medical attention if overdose suspected. Monitor liver function and muscle enzymes.',
    isDemo: true
  },
  {
    id: 'demo-7',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    brandNames: ['Bayer', 'Ecotrin', 'Disprin'],
    category: 'NSAID / Antiplatelet',
    howItWorks: 'Aspirin irreversibly inhibits cyclooxygenase (COX) enzymes, reducing prostaglandin synthesis and thromboxane A2, providing anti-inflammatory, analgesic, antipyretic, and antiplatelet effects.',
    usage: 'Pain relief, fever reduction, anti-inflammatory effects, and prevention of blood clots in cardiovascular disease.',
    dosageGuidance: 'Pain/fever: 325-650 mg every 4-6 hours. Cardiovascular prevention: 75-100 mg once daily.',
    contraindications: ['Aspirin allergy', 'Active bleeding disorders', 'Children under 16 (Reye syndrome risk)', 'Third trimester pregnancy'],
    warnings: ['Can cause stomach bleeding', 'Stop before surgery', 'Not for children with viral illness'],
    precautions: ['Take with food', 'Avoid alcohol', 'Inform doctors before procedures'],
    commonSideEffects: ['Stomach upset', 'Heartburn', 'Nausea', 'Easy bruising'],
    seriousSideEffects: ['Gastrointestinal bleeding', 'Tinnitus (ringing in ears)', 'Severe allergic reaction'],
    overdoseWarning: 'Aspirin overdose (salicylism) can be life-threatening. Symptoms include ringing in ears, rapid breathing, confusion. Seek emergency care immediately.',
    isDemo: true
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm, dose } = await req.json();
    
    console.log(`Searching for drug: ${searchTerm}, dose: ${dose || 'not specified'}`);
    
    // First check demo medicines
    const demoResult = demoMedicines.find(
      med => med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (demoResult) {
      const result = { ...demoResult };
      if (dose) {
        result.name = `${result.name} (${dose})`;
      }
      return new Response(JSON.stringify({ drug: result, source: 'demo' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // If not found in demo, try OpenFDA API
    try {
      const fdaResponse = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(searchTerm)}"+openfda.generic_name:"${encodeURIComponent(searchTerm)}"&limit=1`
      );
      
      if (fdaResponse.ok) {
        const fdaData = await fdaResponse.json();
        
        if (fdaData.results && fdaData.results.length > 0) {
          const result = fdaData.results[0];
          const openfda = result.openfda || {};
          
          const drugInfo = {
            id: `fda-${Date.now()}`,
            name: dose ? `${openfda.brand_name?.[0] || searchTerm} (${dose})` : (openfda.brand_name?.[0] || searchTerm),
            genericName: openfda.generic_name?.[0] || 'Unknown',
            brandNames: openfda.brand_name || [],
            category: openfda.pharm_class_epc?.[0] || 'Unknown category',
            howItWorks: result.mechanism_of_action?.[0]?.substring(0, 500) || 'Information not available',
            usage: result.indications_and_usage?.[0]?.substring(0, 500) || 'Consult healthcare provider',
            dosageGuidance: result.dosage_and_administration?.[0]?.substring(0, 500) || 'Follow prescription guidelines',
            contraindications: result.contraindications?.[0]?.split('.').slice(0, 5) || ['Consult healthcare provider'],
            warnings: result.warnings?.[0]?.split('.').slice(0, 5) || ['Consult healthcare provider'],
            precautions: result.precautions?.[0]?.split('.').slice(0, 5) || ['Consult healthcare provider'],
            commonSideEffects: result.adverse_reactions?.[0]?.split(',').slice(0, 10) || ['Information not available'],
            seriousSideEffects: result.boxed_warning?.[0]?.split('.').slice(0, 5) || ['See package insert'],
            overdoseWarning: result.overdosage?.[0]?.substring(0, 300) || 'Seek immediate medical attention in case of overdose',
            isDemo: false
          };
          
          return new Response(JSON.stringify({ drug: drugInfo, source: 'openfda' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    } catch (fdaError) {
      console.log('OpenFDA API error:', fdaError);
    }
    
    // Return not found
    return new Response(JSON.stringify({ drug: null, message: 'Drug not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in drug-info function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
