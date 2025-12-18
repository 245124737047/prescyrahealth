import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo interactions database
const demoInteractions = [
  {
    id: 'int-1',
    drug1: 'Aspirin',
    drug2: 'Lisinopril',
    severity: 'moderate',
    description: 'Aspirin may reduce the blood pressure lowering effect of Lisinopril.',
    recommendation: 'Monitor blood pressure closely. Consult your doctor if blood pressure is not well controlled.'
  },
  {
    id: 'int-2',
    drug1: 'Metformin',
    drug2: 'Lisinopril',
    severity: 'mild',
    description: 'Both medications may increase the risk of low blood sugar (hypoglycemia).',
    recommendation: 'Monitor blood glucose levels regularly. Watch for symptoms of low blood sugar.'
  },
  {
    id: 'int-3',
    drug1: 'Amoxicillin',
    drug2: 'Metformin',
    severity: 'mild',
    description: 'Amoxicillin may slightly affect Metformin absorption.',
    recommendation: 'Usually not clinically significant. Take as prescribed.'
  },
  {
    id: 'int-4',
    drug1: 'Omeprazole',
    drug2: 'Metformin',
    severity: 'mild',
    description: 'Omeprazole may slightly increase Metformin levels.',
    recommendation: 'Monitor blood glucose. Usually no dose adjustment needed.'
  },
  {
    id: 'int-5',
    drug1: 'Atorvastatin',
    drug2: 'Amoxicillin',
    severity: 'mild',
    description: 'No significant interaction expected between these medications.',
    recommendation: 'Can be taken together safely. Follow prescribed dosages.'
  },
  {
    id: 'int-6',
    drug1: 'Aspirin',
    drug2: 'Omeprazole',
    severity: 'mild',
    description: 'Omeprazole may help protect against aspirin-induced stomach irritation.',
    recommendation: 'This combination is often prescribed together intentionally for stomach protection.'
  },
  {
    id: 'int-7',
    drug1: 'Lisinopril',
    drug2: 'Atorvastatin',
    severity: 'mild',
    description: 'No significant interaction. Both are commonly prescribed together for cardiovascular protection.',
    recommendation: 'Safe to use together. Continue as prescribed.'
  },
  {
    id: 'int-8',
    drug1: 'Aspirin',
    drug2: 'Atorvastatin',
    severity: 'mild',
    description: 'Low-dose aspirin and atorvastatin are often prescribed together for heart health.',
    recommendation: 'Monitor for any unusual bruising or bleeding. Otherwise safe together.'
  },
  {
    id: 'int-9',
    drug1: 'Dolo 650',
    drug2: 'Aspirin',
    severity: 'moderate',
    description: 'Taking paracetamol (Dolo 650) with aspirin increases the risk of side effects. Both affect pain pathways.',
    recommendation: 'Avoid taking together unless directed by doctor. Space doses apart if both are necessary.'
  },
  {
    id: 'int-10',
    drug1: 'Dolo 650',
    drug2: 'Metformin',
    severity: 'mild',
    description: 'No significant interaction expected. Paracetamol is generally safe with Metformin.',
    recommendation: 'Can be used together for pain/fever relief. Use paracetamol as needed.'
  },
  {
    id: 'int-11',
    drug1: 'Dolo 650',
    drug2: 'Lisinopril',
    severity: 'mild',
    description: 'Paracetamol is generally safer than NSAIDs when taking blood pressure medications.',
    recommendation: 'Preferred pain reliever for patients on ACE inhibitors. Use as directed.'
  },
  {
    id: 'int-12',
    drug1: 'Dolo 650',
    drug2: 'Atorvastatin',
    severity: 'mild',
    description: 'Both medications are processed by the liver but interaction is minimal at normal doses.',
    recommendation: 'Safe at recommended doses. Avoid excessive paracetamol use.'
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medications } = await req.json();
    
    console.log(`Checking interactions for medications:`, medications);
    
    if (!medications || !Array.isArray(medications) || medications.length < 2) {
      return new Response(JSON.stringify({ interactions: [], message: 'Need at least 2 medications to check interactions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const foundInteractions: typeof demoInteractions = [];
    
    // Check all pairs of medications
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i].toLowerCase();
        const med2 = medications[j].toLowerCase();
        
        const interaction = demoInteractions.find(int => {
          const d1 = int.drug1.toLowerCase();
          const d2 = int.drug2.toLowerCase();
          return (med1.includes(d1) || d1.includes(med1) || med1.includes(d2) || d2.includes(med1)) &&
                 (med2.includes(d1) || d1.includes(med2) || med2.includes(d2) || d2.includes(med2));
        });
        
        if (interaction) {
          // Map actual medication names to the interaction
          foundInteractions.push({
            ...interaction,
            id: `${interaction.id}-${i}-${j}`,
            drug1: medications[i],
            drug2: medications[j]
          });
        }
      }
    }
    
    return new Response(JSON.stringify({ interactions: foundInteractions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in drug-interactions function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
