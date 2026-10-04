// Static reference content served to the frontend (skin types, routines, ingredients, makeup, tips, quiz).
// Extracted from the original BeautyBloom prototype. Edit here to change site content.
const SKIN_TYPES = [
  { id: "oily", label: "Oily", emoji: "💧", desc: "Shiny by midday, visible pores, breakout-prone." },
  { id: "dry", label: "Dry", emoji: "🏜️", desc: "Tight, flaky, and lacking natural moisture." },
  { id: "combination", label: "Combination", emoji: "🎭", desc: "Oily T-zone, drier cheeks — two skins in one." },
  { id: "normal", label: "Normal", emoji: "✨", desc: "Balanced oil and moisture, few surprises." },
  { id: "sensitive", label: "Sensitive", emoji: "🌸", desc: "Reactive, easily flushed or irritated." },
];

const CONCERNS = ["Acne", "Aging", "Dark Spots", "Dryness", "Oiliness", "Redness", "Dullness", "Large Pores", "Wrinkles", "Hyperpigmentation"];
const GOALS = ["Clear Skin", "Anti-Aging", "Hydration", "Radiant Glow", "Acne Control", "Even Tone", "Sun Protection", "Makeup Skills"];
const MAKEUP_STYLES = ["Natural / Minimal", "Full Glam", "K-Beauty", "Clean Girl", "Bold & Creative", "Soft & Romantic", "Professional", "Everyday Casual"];
const AGE_RANGES = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"];

const ROUTINE_BANK = {
  oily: {
    principles: [
      "Cleanse twice daily without over-stripping natural oil.",
      "Use lightweight, oil-free, non-comedogenic formulas.",
      "Exfoliate 2-3x weekly to keep pores clear.",
      "Never skip moisturizer — dehydration triggers more oil.",
      "Blot midday shine instead of re-cleansing.",
    ],
    avoid: ["Heavy creams and butters", "Alcohol-based toners", "Over-washing (more than 2x/day)", "Skipping SPF because skin feels oily"],
    recommended: ["Gel and foam cleansers", "Clay masks 1-2x weekly", "Niacinamide serums", "Oil-free gel moisturizer"],
    seasonal: { spring: "Switch to a lighter gel moisturizer as humidity rises.", summer: "Blotting sheets and a mattifying SPF are your best friends.", fall: "Reintroduce gentle exfoliation as air dries out.", winter: "Layer a hydrating serum under your usual gel moisturizer." },
    morning: [
      { id: "o-m1", name: "Gel Cleanse", duration: "60 sec", description: "Massage a foaming gel cleanser to lift excess oil without stripping.", product: "Gel Cleanser", ingredients: ["Salicylic Acid", "Tea Tree Oil"] },
      { id: "o-m2", name: "Balancing Toner", duration: "30 sec", description: "Pat in an alcohol-free toner to refine pores.", product: "Toner", ingredients: ["Niacinamide", "Witch Hazel"] },
      { id: "o-m3", name: "Oil-Free SPF", duration: "45 sec", description: "Finish with a mattifying, non-comedogenic sunscreen.", product: "SPF 30+", ingredients: ["Zinc Oxide"] },
    ],
    night: [
      { id: "o-n1", name: "Double Cleanse", duration: "90 sec", description: "Oil cleanser to dissolve sunscreen, then gel cleanser to finish.", product: "Cleansing Oil + Gel", ingredients: ["Squalane"] },
      { id: "o-n2", name: "Exfoliating Treatment", duration: "60 sec", description: "3x/week: apply a BHA to keep pores clear overnight.", product: "BHA Serum", ingredients: ["Salicylic Acid"] },
      { id: "o-n3", name: "Lightweight Gel Moisturizer", duration: "30 sec", description: "Seal in hydration without adding shine.", product: "Gel Moisturizer", ingredients: ["Hyaluronic Acid"] },
    ],
  },
  dry: {
    principles: [
      "Cleanse gently — never let skin feel squeaky-tight.",
      "Layer hydration: humectant serum, then a richer cream.",
      "Exfoliate lightly, no more than 1-2x weekly.",
      "Seal moisture with an occlusive at night.",
      "Use lukewarm (not hot) water on your face.",
    ],
    avoid: ["Foaming sulfate cleansers", "Hot showers on the face", "High-percentage acids", "Alcohol-heavy toners"],
    recommended: ["Cream or milk cleansers", "Hydrating sheet masks", "Facial oils at night", "Rich barrier-repair cream"],
    seasonal: { spring: "Ease off heavy oils as air moisturizes naturally.", summer: "A lighter cream keeps you comfortable in the heat.", fall: "Reintroduce facial oil as humidity drops.", winter: "Add a humidifier and double up on your barrier cream." },
    morning: [
      { id: "d-m1", name: "Cream Cleanse", duration: "45 sec", description: "A milky cleanser removes overnight buildup without stripping.", product: "Cream Cleanser", ingredients: ["Ceramides"] },
      { id: "d-m2", name: "Hydrating Serum", duration: "30 sec", description: "Press in a humectant serum on damp skin to lock in water.", product: "Serum", ingredients: ["Hyaluronic Acid"] },
      { id: "d-m3", name: "Rich Moisturizer + SPF", duration: "60 sec", description: "A nourishing cream followed by broad-spectrum sunscreen.", product: "Cream + SPF", ingredients: ["Squalane", "Zinc Oxide"] },
    ],
    night: [
      { id: "d-n1", name: "Gentle Cleanse", duration: "45 sec", description: "One gentle cleanse is enough — resist double cleansing if it feels tight.", product: "Cream Cleanser", ingredients: ["Ceramides"] },
      { id: "d-n2", name: "Facial Oil", duration: "30 sec", description: "Warm a few drops between palms and press into skin.", product: "Facial Oil", ingredients: ["Squalane"] },
      { id: "d-n3", name: "Barrier Cream", duration: "45 sec", description: "A thick, occlusive cream to seal everything in overnight.", product: "Night Cream", ingredients: ["Ceramides", "Panthenol"] },
    ],
  },
  combination: {
    principles: [
      "Treat your T-zone and cheeks as two different climates.",
      "Multi-mask when needed: clay on the T-zone, cream elsewhere.",
      "Choose a lightweight, balancing moisturizer overall.",
      "Exfoliate the oilier zones slightly more often.",
      "Never skip SPF, even on the drier areas.",
    ],
    avoid: ["One-size-fits-all heavy creams", "Over-exfoliating the whole face at once", "Harsh alcohol toners"],
    recommended: ["Multi-masking", "Gel-cream hybrid moisturizer", "Niacinamide for the T-zone", "Hydrating toner on cheeks"],
    seasonal: { spring: "Start multi-masking as your T-zone gets oilier.", summer: "Mattify the T-zone, keep cheeks lightly hydrated.", fall: "Even out routine as both zones normalize.", winter: "Add extra cream to cheeks while keeping T-zone light." },
    morning: [
      { id: "c-m1", name: "Balancing Cleanse", duration: "60 sec", description: "A gentle gel cleanser that won't over-dry the cheeks.", product: "Gel Cleanser", ingredients: ["Centella Asiatica"] },
      { id: "c-m2", name: "Zone Toner", duration: "30 sec", description: "Focus a pore-refining toner on the T-zone.", product: "Toner", ingredients: ["Niacinamide"] },
      { id: "c-m3", name: "Gel-Cream + SPF", duration: "45 sec", description: "A hybrid moisturizer that hydrates without adding shine.", product: "Gel-Cream + SPF", ingredients: ["Hyaluronic Acid"] },
    ],
    night: [
      { id: "c-n1", name: "Double Cleanse", duration: "75 sec", description: "Oil cleanser first, then a gentle gel to finish.", product: "Cleansing Oil + Gel", ingredients: ["Squalane"] },
      { id: "c-n2", name: "Targeted Treatment", duration: "45 sec", description: "BHA on the T-zone, hydrating serum on the cheeks.", product: "BHA + Serum", ingredients: ["Salicylic Acid", "Hyaluronic Acid"] },
      { id: "c-n3", name: "Balanced Moisturizer", duration: "30 sec", description: "A lightweight cream that suits both zones.", product: "Moisturizer", ingredients: ["Ceramides"] },
    ],
  },
  normal: {
    principles: [
      "Maintain, don't overhaul — your skin's balance is the goal.",
      "Focus on prevention: antioxidants and SPF.",
      "Exfoliate 2x weekly to keep radiance up.",
      "Stay consistent rather than chasing new products.",
      "Adjust richness of moisturizer with the seasons.",
    ],
    avoid: ["Frequently switching active ingredients", "Skipping SPF on cloudy days", "Overloading with too many products"],
    recommended: ["Vitamin C in the morning", "Gentle weekly exfoliation", "A reliable daily moisturizer", "Antioxidant serums"],
    seasonal: { spring: "Add a vitamin C serum as sun exposure increases.", summer: "Lighten your moisturizer and reapply SPF.", fall: "Introduce a gentle retinol for renewal.", winter: "Switch to a slightly richer cream." },
    morning: [
      { id: "n-m1", name: "Gentle Cleanse", duration: "45 sec", description: "A mild cleanser to start the day fresh.", product: "Cleanser", ingredients: ["Panthenol"] },
      { id: "n-m2", name: "Vitamin C Serum", duration: "30 sec", description: "Brighten and protect against environmental stress.", product: "Serum", ingredients: ["Vitamin C"] },
      { id: "n-m3", name: "Moisturizer + SPF", duration: "45 sec", description: "Lock in hydration and protect from UV damage.", product: "Moisturizer + SPF", ingredients: ["Hyaluronic Acid", "Zinc Oxide"] },
    ],
    night: [
      { id: "n-n1", name: "Cleanse", duration: "45 sec", description: "Remove the day's buildup with a gentle formula.", product: "Cleanser", ingredients: ["Ceramides"] },
      { id: "n-n2", name: "Renewal Treatment", duration: "30 sec", description: "2-3x/week: a gentle exfoliating or retinol treatment.", product: "Treatment", ingredients: ["Glycolic Acid"] },
      { id: "n-n3", name: "Night Moisturizer", duration: "30 sec", description: "A comfortable cream to support overnight repair.", product: "Night Cream", ingredients: ["Peptides"] },
    ],
  },
  sensitive: {
    principles: [
      "Patch test every new product for 48 hours.",
      "Keep routines short — fewer products, fewer triggers.",
      "Choose fragrance-free, minimal-ingredient formulas.",
      "Soothe first, treat second.",
      "Introduce one new product at a time.",
    ],
    avoid: ["Fragranced products", "Physical scrubs", "High-percentage acids", "Hot water on the face"],
    recommended: ["Centella Asiatica formulas", "Fragrance-free moisturizers", "Mineral sunscreen", "Cool water rinses"],
    seasonal: { spring: "Watch for seasonal allergy-related flushing.", summer: "Mineral SPF is gentler on reactive skin.", fall: "Reinforce your barrier as air changes.", winter: "Add a richer, fragrance-free balm to prevent flare-ups." },
    morning: [
      { id: "s-m1", name: "Soothing Cleanse", duration: "30 sec", description: "A fragrance-free, low-lather cleanser.", product: "Cleanser", ingredients: ["Centella Asiatica"] },
      { id: "s-m2", name: "Calming Serum", duration: "30 sec", description: "Reduce redness with a soothing, minimal formula.", product: "Serum", ingredients: ["Panthenol"] },
      { id: "s-m3", name: "Mineral SPF", duration: "45 sec", description: "A physical sunscreen that's gentle on reactive skin.", product: "Mineral SPF", ingredients: ["Zinc Oxide"] },
    ],
    night: [
      { id: "s-n1", name: "Gentle Cleanse", duration: "30 sec", description: "Rinse with cool water and a mild cleanser only.", product: "Cleanser", ingredients: ["Ceramides"] },
      { id: "s-n2", name: "Barrier Repair", duration: "30 sec", description: "A ceramide-rich formula to reinforce your skin barrier.", product: "Repair Cream", ingredients: ["Ceramides", "Panthenol"] },
      { id: "s-n3", name: "Occlusive Balm", duration: "20 sec", description: "A thin layer to lock in moisture overnight.", product: "Balm", ingredients: ["Squalane"] },
    ],
  },
};

/* Concern-specific guidance used by the Personalization Engine. Every entry is driven by a Skin Quiz
   (or profile) concern and feeds the skincare notes, makeup notes, ingredient picks and beauty guide. */
const CONCERN_GUIDANCE = {
  "Acne": { ingredients: ["salicylic-acid", "niacinamide", "azelaic-acid"], tip: "Keep pores clear with gentle, consistent BHA use and never skip a lightweight moisturizer.", morning: "Keep the morning simple and oil-free so pores stay clear.", night: "Your evening is the best time for a BHA or azelaic treatment, at the frequency noted in the steps.", makeup: "Choose non-comedogenic, oil-free base products and always remove makeup fully at night." },
  "Aging": { ingredients: ["retinol", "vitamin-c", "hyaluronic-acid"], tip: "Pair morning antioxidants and daily SPF with a night-time retinoid, introduced slowly.", morning: "An antioxidant step plus daily SPF is your most effective anti-aging habit.", night: "Night is the time for renewal — introduce retinol slowly (2-3 nights a week) and buffer with moisturizer.", makeup: "Favor hydrating, light-diffusing bases and cream blush; heavy powder can settle into fine lines." },
  "Dark Spots": { ingredients: ["vitamin-c", "azelaic-acid", "niacinamide"], tip: "Fade discoloration with vitamin C by day and daily SPF — sun exposure darkens spots again.", morning: "Vitamin C and a generously applied SPF matter most for fading dark spots.", night: "Gentle exfoliation or azelaic acid at night helps discoloration fade gradually.", makeup: "Use a color-correcting concealer only on spots and keep the rest of the base light." },
  "Dryness": { ingredients: ["hyaluronic-acid", "ceramides", "squalane"], tip: "Layer a humectant on damp skin, then seal it in with a ceramide cream.", morning: "Apply hydrating layers on damp skin so moisture is drawn in and sealed.", night: "Seal everything in with a richer barrier cream or a few drops of facial oil.", makeup: "Hydrate well before base, and choose cream or liquid formulas over heavy powders." },
  "Oiliness": { ingredients: ["niacinamide", "salicylic-acid", "centella-asiatica"], tip: "Balance oil with niacinamide and a light gel moisturizer — skipping moisturizer makes skin oilier.", morning: "Keep layers lightweight and finish with an oil-free, mattifying SPF.", night: "Don't over-cleanse — a gentle double cleanse and a light gel moisturizer is enough.", makeup: "Use an oil-control primer on the T-zone and set only where shine shows up first." },
  "Redness": { ingredients: ["centella-asiatica", "azelaic-acid", "ceramides"], tip: "Soothe first and treat second: fragrance-free formulas, cool water and a repaired barrier.", morning: "Choose a calming, fragrance-free step and a mineral SPF to avoid triggering flushing.", night: "Barrier repair comes first at night — skip strong actives on days skin looks flushed.", makeup: "A green or neutral color-correcting concealer before base helps neutralize redness." },
  "Dullness": { ingredients: ["vitamin-c", "glycolic-acid", "hyaluronic-acid"], tip: "Brighten with vitamin C in the morning and a gentle weekly exfoliant to lift dead cells.", morning: "Vitamin C plus hydration gives the quickest visible glow.", night: "A gentle exfoliating treatment once or twice a week restores radiance.", makeup: "Finish with a luminous base and a touch of cream highlighter on the high points of the face." },
  "Large Pores": { ingredients: ["niacinamide", "salicylic-acid", "retinol"], tip: "Keep pores clear with BHA and refine their look with niacinamide — consistency beats intensity.", morning: "Niacinamide in the morning helps refine the look of pores under SPF.", night: "A BHA a few nights a week keeps pores clear and visibly smaller.", makeup: "Use a blurring, silicone-based primer on the pores before applying a light base." },
  "Wrinkles": { ingredients: ["retinol", "hyaluronic-acid", "glycolic-acid"], tip: "Retinol at night and hydration by day soften lines over time; SPF prevents new ones.", morning: "Hydrate well and never skip SPF — sun is the main driver of new lines.", night: "A retinoid is your key night-time step; build up frequency gradually.", makeup: "Apply concealer sparingly and use hydrating products so nothing settles into lines." },
  "Hyperpigmentation": { ingredients: ["vitamin-c", "azelaic-acid", "glycolic-acid"], tip: "Fade discoloration gradually with vitamin C, azelaic acid and strict daily sun protection.", morning: "Vitamin C and a high-SPF sunscreen, reapplied, are the foundation of fading pigmentation.", night: "Azelaic acid or a gentle AHA at night fades discoloration gradually.", makeup: "Color-correct only where needed and layer a buildable base for an even finish." },
};

const SENSITIVITY_GUIDANCE = {
  high: { ingredients: ["centella-asiatica", "ceramides"], skincare: "Your quiz showed high sensitivity, so patch test new products for 48 hours and add only one new step at a time.", makeup: "Because your skin is highly sensitive, choose fragrance-free, hypoallergenic formulas and patch test new base products." },
  medium: { ingredients: [], skincare: "Your quiz showed moderate sensitivity, so introduce new actives gradually.", makeup: "" },
  low: { ingredients: [], skincare: "Your quiz showed low sensitivity, so your skin can usually tolerate actives well — still build up gradually.", makeup: "" },
};

const INGREDIENTS = [
  { id: "hyaluronic-acid", name: "Hyaluronic Acid", category: "Humectant", rating: 5, description: "A moisture magnet that holds up to 1000x its weight in water, plumping skin instantly.", benefits: ["Hydration", "Plumping", "Fine Line Softening"], bestFor: ["dry", "normal", "combination", "sensitive"], helps: ["Dryness", "Wrinkles", "Dullness"], precautions: ["Apply to damp skin — on dry skin it can pull moisture from deeper layers."] },
  { id: "niacinamide", name: "Niacinamide", category: "Vitamin", rating: 5, description: "A multitasking form of vitamin B3 that regulates oil and refines the look of pores.", benefits: ["Oil Control", "Pore Refining", "Brightening"], bestFor: ["oily", "combination", "normal"], helps: ["Oiliness", "Large Pores", "Redness"], precautions: ["Can pill when layered with certain acidic serums."] },
  { id: "salicylic-acid", name: "Salicylic Acid", category: "BHA Exfoliant", rating: 4, description: "An oil-soluble acid that dives into pores to clear congestion and breakouts.", benefits: ["Unclogs Pores", "Exfoliation", "Acne Control"], bestFor: ["oily", "combination"], helps: ["Acne", "Large Pores", "Oiliness"], precautions: ["Can be drying — start with 2-3x weekly.", "Increases sun sensitivity."] },
  { id: "retinol", name: "Retinol", category: "Vitamin A Derivative", rating: 5, description: "The gold-standard ingredient for cell turnover, texture, and long-term anti-aging.", benefits: ["Anti-Aging", "Texture", "Cell Renewal"], bestFor: ["normal", "oily", "combination"], helps: ["Wrinkles", "Aging", "Dullness"], precautions: ["Start slow, 1-2x weekly.", "Always follow with SPF the next morning.", "Avoid if pregnant."] },
  { id: "vitamin-c", name: "Vitamin C", category: "Antioxidant", rating: 4, description: "A brightening antioxidant that fights environmental damage and evens tone.", benefits: ["Brightening", "Antioxidant Protection", "Even Tone"], bestFor: ["normal", "dry", "combination"], helps: ["Dullness", "Dark Spots", "Hyperpigmentation"], precautions: ["Can oxidize — store in a cool, dark place.", "Patch test if sensitive."] },
  { id: "ceramides", name: "Ceramides", category: "Barrier Lipid", rating: 5, description: "Natural lipids that rebuild and reinforce your skin's protective barrier.", benefits: ["Barrier Repair", "Moisture Retention", "Soothing"], bestFor: ["dry", "sensitive", "normal"], helps: ["Dryness", "Redness"], precautions: ["Generally well tolerated by all skin types."] },
  { id: "glycolic-acid", name: "Glycolic Acid", category: "AHA Exfoliant", rating: 4, description: "The smallest AHA molecule, exfoliating the surface for smoother, brighter skin.", benefits: ["Exfoliation", "Brightening", "Smoothing"], bestFor: ["normal", "oily", "combination"], helps: ["Dullness", "Hyperpigmentation", "Wrinkles"], precautions: ["Increases sun sensitivity.", "Avoid pairing with retinol on the same night."] },
  { id: "centella-asiatica", name: "Centella Asiatica (Cica)", category: "Botanical Extract", rating: 5, description: "A calming herb long used to soothe irritation and support skin repair.", benefits: ["Soothing", "Redness Reduction", "Barrier Support"], bestFor: ["sensitive", "combination", "oily"], helps: ["Redness", "Acne"], precautions: ["Very low risk of irritation."] },
  { id: "squalane", name: "Squalane", category: "Emollient", rating: 4, description: "A lightweight, non-greasy oil that mimics skin's natural lipids.", benefits: ["Lightweight Hydration", "Softening", "Barrier Support"], bestFor: ["dry", "normal", "oily", "sensitive"], helps: ["Dryness"], precautions: ["Rarely, can feel heavy on very oily skin in humid climates."] },
  { id: "azelaic-acid", name: "Azelaic Acid", category: "Multi-Acid", rating: 4, description: "A gentle acid that calms redness while fading discoloration.", benefits: ["Redness Reduction", "Brightening", "Anti-Acne"], bestFor: ["sensitive", "combination", "oily"], helps: ["Redness", "Hyperpigmentation", "Acne"], precautions: ["Mild tingling on first use is normal."] },
];

const MAKEUP_GUIDES = {
  oily: { baseTechnique: "Prime with a mattifying primer, then apply foundation with a damp sponge for a skin-like finish.", foundationType: "Long-wear matte or semi-matte liquid foundation", finish: "Matte", prep: "Use an oil-control primer focused on the T-zone.", concealer: "A matte, full-coverage concealer set immediately with powder.", powder: "Loose translucent powder pressed (not swiped) onto oily areas.", blush: "Cream blush before powder for a natural flush that lasts.", eyeTips: "Use an eyeshadow primer to prevent creasing by midday.", lipTips: "Matte or satin lip formulas outlast oil better than gloss.", removal: "Use a gentle oil cleanser to fully dissolve makeup before your gel cleanser." },
  dry: { baseTechnique: "Prime with a hydrating primer, then apply foundation with fingertips or a brush for a dewy finish.", foundationType: "Hydrating, dewy-finish liquid or serum foundation", finish: "Dewy / Luminous", prep: "Layer a nourishing moisturizer and let it absorb fully before base.", concealer: "A creamy, hydrating concealer blended with a damp sponge.", powder: "Minimal powder — only where needed, like the T-zone.", blush: "Cream or liquid blush blended with fingertips for a natural glow.", eyeTips: "Cream eyeshadows blend beautifully and won't emphasize dry patches.", lipTips: "Balm-based tints or glosses keep lips comfortable all day.", removal: "A rich cleansing balm melts away makeup without stripping moisture." },
  combination: { baseTechnique: "Prime the T-zone with mattifying primer and cheeks with hydrating primer, then apply foundation evenly.", foundationType: "Satin-finish medium-coverage foundation", finish: "Satin", prep: "Use two primers: mattifying on the T-zone, hydrating on the cheeks.", concealer: "A satin-finish concealer that won't emphasize either zone.", powder: "Powder only the T-zone to control shine.", blush: "Cream blush on cheeks for glow, powder blush layered for longevity.", eyeTips: "A light primer keeps color vivid without creasing.", lipTips: "Satin lipsticks give color without drying out lips.", removal: "Double cleanse: oil cleanser first, then a gentle gel cleanser." },
  normal: { baseTechnique: "Apply a lightweight primer, then buildable foundation for a natural, skin-like finish.", foundationType: "Buildable medium-coverage foundation", finish: "Natural / Satin", prep: "A simple hydrating primer is usually all you need.", concealer: "Any finish works well — choose based on desired coverage.", powder: "Light setting powder only where needed.", blush: "Cream or powder blush both perform beautifully.", eyeTips: "Most eyeshadow formulas apply and blend easily.", lipTips: "You can wear almost any lip finish comfortably.", removal: "A standard makeup remover or micellar water works well." },
  sensitive: { baseTechnique: "Prime with a soothing, fragrance-free primer, then apply mineral or hypoallergenic foundation with clean fingertips.", foundationType: "Mineral or hypoallergenic, fragrance-free foundation", finish: "Natural", prep: "Let skincare fully absorb; avoid layering too many products before base.", concealer: "A fragrance-free, mineral concealer to avoid triggering redness.", powder: "Mineral setting powder, applied lightly.", blush: "Mineral powder blush is gentlest on reactive skin.", eyeTips: "Patch test new eyeshadow formulas — the eye area is especially sensitive.", lipTips: "Fragrance-free, hypoallergenic lip formulas reduce reaction risk.", removal: "A gentle micellar water or fragrance-free balm, followed by a cool rinse." },
};

const LOOKS = [
  { id: "glass-skin", name: "Glass Skin Glow", occasion: "Everyday", description: "A luminous, hydrated base that looks like skin, only better.", difficulty: "beginner", time: "10 min", skinTypes: ["dry", "normal", "combination"], steps: ["Prep with a hydrating essence and let it sink in.", "Apply a dewy foundation with fingertips, patting rather than rubbing.", "Add cream highlighter to cheekbones and brow bone.", "Set only the T-zone with a whisper of translucent powder."] },
  { id: "soft-matte-glam", name: "Soft Matte Glam", occasion: "Evening", description: "Full coverage with a soft-focus matte finish that photographs beautifully.", difficulty: "intermediate", time: "25 min", skinTypes: ["oily", "combination"], steps: ["Prime with a mattifying, pore-blurring primer.", "Buff in full-coverage matte foundation with a brush.", "Bake concealer under the eyes for 3-5 minutes, then dust off.", "Contour and set with a fine mist to soften edges."] },
  { id: "clean-girl", name: "Clean Girl Aesthetic", occasion: "Everyday", description: "Minimal, dewy, and effortless — skin first, makeup second.", difficulty: "beginner", time: "8 min", skinTypes: ["normal", "dry", "sensitive"], steps: ["Even out skin with a tinted moisturizer or skin tint.", "Spot conceal only where needed.", "Sweep a cream bronzer along the cheekbones.", "Groom brows and add a clear or tinted balm to lips."] },
  { id: "romantic-soft-focus", name: "Romantic Soft Focus", occasion: "Date Night", description: "Blurred edges, flushed cheeks, and soft rosy tones throughout.", difficulty: "intermediate", time: "20 min", skinTypes: ["sensitive", "normal", "dry"], steps: ["Apply a soft-focus primer to blur texture.", "Blend cream blush high on the cheeks and diffuse outward.", "Use soft brown eyeliner smudged along the lash line.", "Finish lips with a rosy balm for a your-lips-but-better effect."] },
  { id: "bold-statement", name: "Bold Statement", occasion: "Night Out", description: "A graphic eye or bold lip takes center stage against a clean base.", difficulty: "advanced", time: "30 min", skinTypes: ["oily", "combination", "normal"], steps: ["Create a clean, matte base to let the statement feature shine.", "Build a graphic winged liner or a deep smoky eye.", "Keep the rest of the face minimal to balance the bold feature.", "Set with a long-wear setting spray for all-night hold."] },
  { id: "natural-radiance", name: "Natural Radiance", occasion: "Everyday", description: "Barely-there makeup that enhances your natural glow.", difficulty: "beginner", time: "10 min", skinTypes: ["dry", "normal", "combination", "sensitive"], steps: ["Mix a drop of illuminating drops into your moisturizer.", "Conceal only visible redness or dark circles.", "Curl lashes and apply a single coat of mascara.", "Tap cream blush onto the apples of the cheeks."] },
];

const TIPS = [
  { id: "t1", category: "skincare", title: "The 2-Minute Cleanse Rule", content: "Massage your cleanser for a full two minutes before rinsing — most people rush this to 15 seconds, missing most of the benefit.", skinTypes: ["oily", "combination", "normal", "dry", "sensitive"], concerns: ["Dullness"] },
  { id: "t2", category: "skincare", title: "Apply Moisturizer on Damp Skin", content: "Pat products onto slightly damp skin to help humectants like hyaluronic acid draw in extra water.", skinTypes: ["dry", "normal", "sensitive"], concerns: ["Dryness"] },
  { id: "t3", category: "skincare", title: "SPF Needs Reapplication", content: "Sunscreen loses effectiveness after about two hours outdoors — keep a powder or spray SPF on hand to reapply over makeup.", skinTypes: ["oily", "dry", "combination", "normal", "sensitive"], concerns: ["Aging", "Dark Spots"] },
  { id: "t4", category: "skincare", title: "Patch Test Everything New", content: "Apply new products to your inner arm for 48 hours before your face — it's the single best way to prevent a reaction.", skinTypes: ["sensitive"], concerns: ["Redness"] },
  { id: "t5", category: "skincare", title: "The Buffer Method for Actives", content: "Apply moisturizer before a strong active like retinol to buffer its intensity while you build tolerance.", skinTypes: ["sensitive", "dry", "normal"], concerns: ["Redness", "Aging"] },
  { id: "t6", category: "skincare", title: "Don't Skip Neck and Décolletage", content: "Extend your skincare routine past the jawline — this skin shows aging just as fast and is often forgotten.", skinTypes: ["normal", "dry", "combination", "oily", "sensitive"], concerns: ["Aging"] },
  { id: "t7", category: "makeup", title: "Cream Before Powder", content: "Always layer cream products before powder ones (never the reverse) for a smooth, long-lasting finish.", skinTypes: ["oily", "combination", "dry", "normal"], concerns: [] },
  { id: "t8", category: "lifestyle", title: "Pillowcase Hygiene Matters", content: "Change your pillowcase twice a week — it collects oil, product, and bacteria that can trigger breakouts.", skinTypes: ["oily", "combination"], concerns: ["Acne"] },
  { id: "t9", category: "lifestyle", title: "Silk Pillowcases for Sensitive Skin", content: "Silk creates less friction against skin overnight, which can reduce irritation for reactive skin types.", skinTypes: ["sensitive", "dry"], concerns: ["Redness"] },
  { id: "t10", category: "lifestyle", title: "Hydration Starts From Within", content: "Skin is the last organ to receive water you drink — consistent hydration over days shows up as a visible glow.", skinTypes: ["dry", "normal", "combination", "oily", "sensitive"], concerns: ["Dullness", "Dryness"] },
  { id: "t11", category: "lifestyle", title: "Sleep Position Leaves Marks", content: "Side-sleeping can create temporary creases that, over years, may become permanent — try sleeping on your back when you can.", skinTypes: ["normal", "dry"], concerns: ["Wrinkles"] },
  { id: "t12", category: "ingredients", title: "Don't Mix Retinol and Vitamin C", content: "Use vitamin C in the morning and retinol at night — combined, they can cancel each other out and irritate skin.", skinTypes: ["normal", "oily", "combination"], concerns: ["Aging"] },
  { id: "t13", category: "ingredients", title: "Niacinamide Plays Well With Almost Everything", content: "Unlike many actives, niacinamide is gentle enough to layer with acids, retinol, and vitamin C.", skinTypes: ["oily", "combination", "normal"], concerns: ["Oiliness", "Large Pores"] },
];

const QUIZ_QUESTIONS = [
  { id: "q1", question: "How does your skin feel about an hour after washing?", options: [
    { text: "Tight, sometimes flaky", type: "dry" }, { text: "Shiny all over", type: "oily" },
    { text: "Shiny in the T-zone, normal on cheeks", type: "combination" }, { text: "Comfortable and balanced", type: "normal" } ] },
  { id: "q2", question: "How often do you experience breakouts?", options: [
    { text: "Frequently, especially around the T-zone", type: "oily" }, { text: "Rarely, but skin can react to new products", type: "sensitive" },
    { text: "Occasionally along the jawline or chin", type: "combination" }, { text: "Almost never", type: "normal" } ] },
  { id: "q3", question: "How does your skin react to a new skincare product?", options: [
    { text: "Redness, stinging, or itching within minutes", type: "high" }, { text: "Occasional mild reaction", type: "medium" },
    { text: "Rarely reacts, but I stay cautious", type: "medium" }, { text: "No reaction, ever", type: "low" } ] },
  { id: "q4", question: "By midday, how does your forehead look?", options: [
    { text: "Visibly shiny", type: "oily" }, { text: "Dry and dull-looking", type: "dry" },
    { text: "Shiny in the center, matte at the temples", type: "combination" }, { text: "Looks the same as this morning", type: "normal" } ] },
  { id: "q5", question: "How would you describe the size of your pores?", options: [
    { text: "Large and visible, especially on the nose", type: "oily" }, { text: "Barely visible", type: "dry" },
    { text: "Larger in the T-zone only", type: "combination" }, { text: "Small and consistent", type: "normal" } ] },
  { id: "q6", question: "How does your skin behave in cold weather?", options: [
    { text: "Gets tight, flaky, or irritated", type: "dry" }, { text: "Becomes red or reactive quickly", type: "sensitive" },
    { text: "Stays mostly the same", type: "normal" }, { text: "Gets a little dry but no major change", type: "combination" } ] },
  { id: "q7", question: "What's your primary skin concern right now?", options: [
    { text: "Breakouts and clogged pores", concern: "Acne", type: "oily" }, { text: "Fine lines and loss of firmness", concern: "Aging", type: "normal" },
    { text: "Dark spots or uneven tone", concern: "Dark Spots", type: "combination" }, { text: "Redness and irritation", concern: "Redness", type: "sensitive" } ] },
];

function scoreQuiz(answers) {
  const tally = {};
  Object.values(answers).forEach((a) => { if (a?.type && ["oily", "dry", "combination", "normal", "sensitive"].includes(a.type)) tally[a.type] = (tally[a.type] || 0) + 1; });
  let skinType = "normal", top = -1;
  Object.entries(tally).forEach(([k, v]) => { if (v > top) { top = v; skinType = k; } });
  const sensAnswer = answers.q3;
  const sensitivity = sensAnswer?.type === "high" ? "high" : sensAnswer?.type === "low" ? "low" : "medium";
  const concernAnswer = answers.q7;
  const concerns = concernAnswer?.concern ? [concernAnswer.concern] : [];
  return { resultSkinType: skinType, resultConcerns: concerns, resultSensitivity: sensitivity, completedAt: new Date().toISOString() };
}

const { VIDEOS } = require('./videos');

module.exports = {
  VIDEOS,
  SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES,
  ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS, scoreQuiz, CONCERN_GUIDANCE, SENSITIVITY_GUIDANCE,
};
