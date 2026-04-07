const express = require('express');
const { generateSkillsPrompt, getAvailableSkills } = require('../../app/clients/prompts/skills');

const router = express.Router();

/**
 * GET /skills
 * Returns list of available skills
 */
router.get('/', async (req, res) => {
  console.log('Skills API endpoint called');
  try {
    const skills = await getAvailableSkills();
    console.log('Fetched skills:', skills);
    res.json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

/**
 * POST /skills/generate
 * Generates skills prompt for given enabled skills
 */
router.post('/generate', async (req, res) => {
  try {
    const { enabledSkills } = req.body;

    if (!Array.isArray(enabledSkills)) {
      return res.status(400).json({ error: 'enabledSkills must be an array' });
    }

    const prompt = await generateSkillsPrompt(enabledSkills);
    res.json({ prompt });
  } catch (error) {
    console.error('Error generating skills prompt:', error);
    res.status(500).json({ error: 'Failed to generate skills prompt' });
  }
});

module.exports = router;
