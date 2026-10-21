export interface HealthClaim {
  id: string;
  claim: string;
  verdict: 'TRUE' | 'FALSE' | 'PARTIALLY TRUE' | 'MYTH' | 'UNPROVEN';
  source: string;
  explanation: string;
  crossVerified: boolean;
  category: 'Nutrition' | 'Anatomy & Body' | 'Immunity & Disease' | 'Brain & Sleep' | 'Lifestyle';
  tags: string[];
}

export const HEALTH_MYTHS_DATABASE: HealthClaim[] = [
  {
    id: 'sugar-hyperactivity',
    claim: 'Eating sugar causes hyperactivity in kids',
    verdict: 'FALSE',
    source: 'Multiple studies reviewed by health experts',
    explanation: 'Research shows sugar does not directly cause hyperactivity. Dietary myths can be misleading.',
    crossVerified: true,
    category: 'Nutrition',
    tags: ['sugar', 'hyperactivity', 'kids', 'children', 'sweets', 'candy', 'adhd', 'energy']
  },
  {
    id: 'carrots-eyesight',
    claim: 'Eating carrots improves your eyesight',
    verdict: 'PARTIALLY TRUE',
    source: 'American Academy of Ophthalmology & British Royal Air Force Archives',
    explanation: 'Carrots contain beta-carotene which the body converts into Vitamin A, essential for retinal function and preventing night blindness. However, eating extra carrots will not give you superhuman 20/20 vision or reverse refractive eye disorders.',
    crossVerified: true,
    category: 'Nutrition',
    tags: ['carrots', 'eyesight', 'vision', 'vitamin a', 'night blindness', 'eyes']
  },
  {
    id: 'cracking-knuckles',
    claim: 'Cracking knuckles causes arthritis',
    verdict: 'FALSE',
    source: 'Harvard Health Publishing & Journal of the American Board of Family Medicine',
    explanation: 'The popping sound is produced when nitrogen gas bubbles burst inside synovial joint fluid. Long-term studies, including 50-year self-experiments, show no increased risk of osteoarthritis from knuckle cracking.',
    crossVerified: true,
    category: 'Anatomy & Body',
    tags: ['knuckles', 'cracking', 'joints', 'arthritis', 'hands', 'fingers']
  },
  {
    id: 'cold-weather-colds',
    claim: 'Cold weather causes the common cold',
    verdict: 'FALSE',
    source: 'Centers for Disease Control and Prevention (CDC)',
    explanation: 'Colds and respiratory infections are caused by airborne viruses (such as rhinoviruses), not cold air temperature itself. Cold weather simply prompts people to spend more time indoors together with poorer ventilation.',
    crossVerified: true,
    category: 'Immunity & Disease',
    tags: ['cold', 'weather', 'common cold', 'flu', 'winter', 'illness', 'virus']
  },
  {
    id: '8-glasses-water',
    claim: 'You need to drink 8 glasses of water every day',
    verdict: 'FALSE',
    source: 'National Academies of Sciences, Engineering, and Medicine',
    explanation: 'Hydration requirements vary significantly by body mass, physical exertion, and environmental climate. Furthermore, water intake from meals, coffee, tea, and fruits provides roughly 20% to 30% of daily hydration.',
    crossVerified: true,
    category: 'Lifestyle',
    tags: ['water', 'hydration', '8 glasses', 'drink', 'fluids', 'kidneys']
  },
  {
    id: '10-percent-brain',
    claim: 'Humans only use 10% of their brain',
    verdict: 'FALSE',
    source: 'Society for Neuroscience & Functional MRI Clinical Studies',
    explanation: 'Brain imaging technologies such as fMRI and PET scans demonstrate that nearly all regions of the human brain have identified functions and remain metabolically active throughout everyday tasks and sleep.',
    crossVerified: true,
    category: 'Brain & Sleep',
    tags: ['brain', '10%', 'ten percent', 'intelligence', 'neurology', 'mind']
  },
  {
    id: 'shaving-hair-thicker',
    claim: 'Shaving makes hair grow back thicker and darker',
    verdict: 'FALSE',
    source: 'Mayo Clinic & Journal of Investigative Dermatology',
    explanation: 'Shaving cuts hair shafts at their blunt cross-section instead of the naturally tapered end, creating a brief coarse feel. It has zero impact on hair follicle density, color melanin, or biological growth rate.',
    crossVerified: true,
    category: 'Anatomy & Body',
    tags: ['shaving', 'hair', 'thicker', 'darker', 'razor', 'beard', 'follicle']
  },
  {
    id: 'detox-cleanses',
    claim: 'Detox teas and cleanses flush toxins from your organs',
    verdict: 'FALSE',
    source: 'National Institutes of Health (NIH)',
    explanation: 'A healthy human body is equipped with its own constant detoxification system: the liver, kidneys, lungs, digestive tract, and skin. Commercial detox products lack peer-reviewed validation and can induce mineral depletion.',
    crossVerified: true,
    category: 'Nutrition',
    tags: ['detox', 'cleanse', 'toxins', 'tea', 'juice fast', 'liver', 'flush']
  },
  {
    id: 'swimming-after-eating',
    claim: 'Swimming right after eating causes dangerous cramps',
    verdict: 'FALSE',
    source: 'American Red Cross Advisory Council on First Aid',
    explanation: 'While swimming vigorously after a large meal may lead to mild discomfort or acid reflux, scientific reviews find zero documented drowning fatalities triggered by post-meal swimming cramps.',
    crossVerified: true,
    category: 'Lifestyle',
    tags: ['swimming', 'eating', 'cramps', 'drowning', 'pool', 'swim', 'meal']
  },
  {
    id: 'gum-7-years',
    claim: 'Chewing gum takes 7 years to digest if swallowed',
    verdict: 'FALSE',
    source: 'Mayo Clinic Gastroenterology Reviews',
    explanation: 'While the synthetic gum base is not broken down by digestive enzymes, peristalsis moves it along with routine food waste, passing through the intestinal tract and out of the body within 24 to 72 hours.',
    crossVerified: true,
    category: 'Nutrition',
    tags: ['gum', 'chewing gum', 'digest', '7 years', 'stomach', 'swallow']
  },
  {
    id: 'vitamin-c-prevents-colds',
    claim: 'Vitamin C supplements prevent you from catching a cold',
    verdict: 'PARTIALLY TRUE',
    source: 'Cochrane Database of Systematic Reviews',
    explanation: 'Systematic clinical trials reveal that high-dose Vitamin C does not reduce the frequency of colds in normal populations, though regular preventative use may shorten symptom duration by about 8% to 14%.',
    crossVerified: true,
    category: 'Immunity & Disease',
    tags: ['vitamin c', 'colds', 'immunity', 'ascorbic acid', 'prevention']
  },
  {
    id: 'microwaves-nutrients',
    claim: 'Microwaving food destroys its nutrients',
    verdict: 'FALSE',
    source: 'Harvard Medical School Health Publishing',
    explanation: 'Because microwave cooking heats food rapidly with minimal added liquid, it actually preserves more temperature-sensitive vitamins (like Vitamin C and Folate) than boiling or deep frying.',
    crossVerified: true,
    category: 'Nutrition',
    tags: ['microwave', 'food', 'nutrients', 'vitamins', 'radiation', 'cooking']
  },
  {
    id: 'reading-dim-light',
    claim: 'Reading in dim light permanently damages your eyes',
    verdict: 'FALSE',
    source: 'American Academy of Ophthalmology',
    explanation: 'Reading in low illumination causes temporary asthenopia (eye strain, dry eyes, and fatigue) from infrequent blinking, but does not cause anatomical changes or long-term vision loss.',
    crossVerified: true,
    category: 'Lifestyle',
    tags: ['reading', 'dim light', 'dark', 'eyes', 'vision damage', 'strain']
  },
  {
    id: 'sweating-toxins',
    claim: 'Sweating heavily in saunas releases toxic heavy metals',
    verdict: 'FALSE',
    source: 'Environmental Science & Technology Journal & Harvard Health',
    explanation: 'Human sweat is composed of 99% water with trace electrolytes (sodium and potassium). The liver and kidneys process and excrete greater than 99% of metabolic waste; sweat glands exist primarily for thermoregulation.',
    crossVerified: true,
    category: 'Lifestyle',
    tags: ['sweating', 'sauna', 'toxins', 'heavy metals', 'detox']
  },
  {
    id: 'egg-yolks-cholesterol',
    claim: 'Eating egg yolks causes heart attacks due to cholesterol',
    verdict: 'FALSE',
    source: 'American Heart Association & BMJ Systematic Review',
    explanation: 'Dietary cholesterol in whole eggs has minimal impact on serum LDL cholesterol for most people. Saturated fats and trans fats have a much greater effect on cardiovascular risk than dietary cholesterol from eggs.',
    crossVerified: true,
    category: 'Nutrition',
    tags: ['eggs', 'cholesterol', 'yolks', 'heart', 'cardiovascular', 'diet']
  }
];

// Normalized string comparison helper
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .trim();
}

export function findHealthClaim(query: string): HealthClaim | null {
  const normalizedQuery = cleanText(query);
  if (!normalizedQuery) return null;

  // 1. Direct or substring match on claim
  for (const myth of HEALTH_MYTHS_DATABASE) {
    const normalizedClaim = cleanText(myth.claim);
    if (normalizedClaim === normalizedQuery || normalizedClaim.includes(normalizedQuery) || normalizedQuery.includes(normalizedClaim)) {
      return myth;
    }
  }

  // 2. Token overlap and keyword similarity
  const queryTokens = normalizedQuery.split(/\s+/).filter(t => t.length > 2);
  if (queryTokens.length === 0) return null;

  let bestMatch: HealthClaim | null = null;
  let highestScore = 0;

  for (const myth of HEALTH_MYTHS_DATABASE) {
    const claimTokens = cleanText(myth.claim).split(/\s+/);
    const tagTokens = myth.tags.map(t => cleanText(t));
    let score = 0;

    for (const token of queryTokens) {
      if (claimTokens.includes(token)) score += 3;
      if (tagTokens.some(t => t.includes(token) || token.includes(t))) score += 2;
    }

    // Require at least 2 distinct token matches or a high-confidence match
    if (score >= 4 && score > highestScore) {
      highestScore = score;
      bestMatch = myth;
    }
  }

  return bestMatch;
}
