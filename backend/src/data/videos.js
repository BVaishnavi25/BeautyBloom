/* =====================================================================
   TUTORIAL VIDEOS — real YouTube tutorials, one per tutorial.
   Each video was chosen by matching its title/description/chapters to the tutorial's
   exact content (skin type + AM/PM, makeup look, or ingredient). Only the 11-character
   YouTube id and the video's own title are stored; the player builds the embed URL.
   Routine and makeup-technique videos are keyed by SKIN TYPE, so the video a user
   sees follows the skin type saved from their Skin Quiz.
   To change a video, replace the id here (nothing else needs editing).
   A tutorial with no entry (centella-asiatica, squalane) simply shows no video.
   ===================================================================== */
const v = (id, title) => ({ id, title });

const VIDEOS = {
  routine: {
    oily: {
      morning: v('3Y4NoUwneMw', 'Morning Summer Skincare Routine For Oily Acne Prone Skin'),
      night: v('orpyztfC-DI', 'Nighttime Skincare Routine For Clear Skin & Oil Control'),
    },
    dry: {
      morning: v('aG1fKNRkcBo', 'My Morning Skincare Routine For Dry Skin'),
      night: v('ew1900xJVmM', 'Dry Skin - Top Tips + Best Night & Morning Skincare Routines For Dry Skin'),
    },
    combination: {
      morning: v('i93oo3tHEOU', 'My Simple Morning Skincare Routine - Refreshing, Quick, and Clean (combination skin)'),
      night: v('nShDZa4GitM', 'Night Time Skincare Routine for Oily Combination Skin'),
    },
    normal: {
      morning: v('QFUrGGJyupw', 'How To Build The Perfect Morning Skincare Routine'),
      night: v('BNTK9QOuGdQ', 'How To Build A Nighttime Skincare Routine From Scratch'),
    },
    sensitive: {
      morning: v('yOHdWzBefPM', 'Sensitive Skin Skincare Routine with the Best Drugstore Products'),
      night: v('rLvG41LJ5sE', 'My Sensitive Skin Nighttime Skincare Routine as a Dermatologist'),
    },
  },
  makeup: {
    oily: v('6UgG5TtiV-o', 'Full Face Drugstore Makeup Routine for Oily Skin (All Day Matte)'),
    dry: v('A5NXnU5nJTU', 'Dry Skin Makeup Tutorial: What Actually Works'),
    combination: v('g8wfLBROMcM', 'How to Do Makeup for Oily Combination Skin'),
    normal: v('IeyeJONm27A', 'Easy Makeup Tutorial for a Natural Look (Beginner Friendly)'),
    sensitive: v('Fo01BWWJA-Q', 'Natural Makeup Tutorial for Beginners - Step by Step for Sensitive + Acne Prone Skin'),
  },
  looks: {
    'glass-skin': v('BJ_HjQnSSug', 'Dewy Glass Skin Makeup'),
    'soft-matte-glam': v('ROc8l8sxZAs', 'The Perfect Soft Glam - Neutral Matte'),
    'clean-girl': v('oIBunTkUS_w', 'The Ultimate Glowy Clean Girl Makeup Tutorial'),
    'romantic-soft-focus': v('dKaFqfFJyws', 'Soft Rose Romantic Makeup'),
    'bold-statement': v('Gfxaz3MQP24', 'Graphic Winged Eyeliner With Glitter'),
    'natural-radiance': v('sWaDmfK1Bvc', 'How to Create a Natural, "No Makeup" Makeup Look for Everyday Wear'),
  },
  ingredients: {
    'hyaluronic-acid': v('v-1BBpJs1rE', 'How to Use a Hyaluronic Acid Serum | Dr Dray'),
    'niacinamide': v('sJFVnhjv5ng', 'How to Use Niacinamide The Right Way'),
    'salicylic-acid': v('leaORDqh75A', "How to Use Paula's Choice 2% BHA (Salicylic Acid) Liquid Exfoliant"),
    'retinol': v('Ryigxul7C7w', 'How to Use Retinol the Right Way for Anti Aging'),
    'vitamin-c': v('Eik7Rcil1Vk', "Do You Need Vitamin C Serum? Dermatologist's Affordable Morning Skincare Routine"),
    'ceramides': v('fYrucnknvaE', 'Skin Barrier Repair: My Full Ceramide Routine for a Damaged Moisture Barrier'),
    'glycolic-acid': v('uSj-N5BLWTg', 'How to Use Acids for Your Skin Type | Dr Dray'),
    'azelaic-acid': v('4By-S9xY4h8', 'Azelaic Acid Is Underrated in Skincare - What You Need to Know'),
    // 'centella-asiatica' and 'squalane': no matching tutorial video found yet.
  },
};

module.exports = { VIDEOS };
