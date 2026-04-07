const fs = require('fs').promises;
const path = require('path');
const dedent = require('dedent');

/**
 * Read all skills files from the skills directory and combine their content
 * @param {string[]} enabledSkills - Array of enabled skill filenames
 * @returns {Promise<string>} Combined skills prompt
 */
const generateSkillsPrompt = async (enabledSkills) => {
  if (!enabledSkills || enabledSkills.length === 0) {
    return null;
  }

  const skillsDir = path.join(__dirname, '../../../data/skills');
  let skillsPrompt = '';

  for (const skillFile of enabledSkills) {
    try {
      const filePath = path.join(skillsDir, skillFile);
      const content = await fs.readFile(filePath, 'utf8');

      // Extract skill name from filename (remove .md extension)
      const skillName = skillFile
        .replace('.md', '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      skillsPrompt += `\n\n# ${skillName} Skill\n\n${content}`;
    } catch (error) {
      console.error(`Error reading skill file ${skillFile}:`, error);
      continue;
    }
  }

  if (skillsPrompt.trim() === '') {
    return null;
  }

  return dedent`
    ## Skills Activated
    
    The following skills have been activated for this conversation. Use these guidelines to enhance your responses:
    
    ${skillsPrompt}
    
    Remember to apply these skills appropriately based on the user's request and context.
  `;
};

/**
 * Get list of available skills files
 * @returns {Promise<string[]>} Array of skill filenames
 */
const getAvailableSkills = async () => {
  const skillsDir = path.join(__dirname, '../../../data/skills');
  try {
    const files = await fs.readdir(skillsDir);
    return files.filter((file) => file.endsWith('.md'));
  } catch (error) {
    console.error('Error reading skills directory:', error);
    return [];
  }
};

module.exports = {
  generateSkillsPrompt,
  getAvailableSkills,
};
