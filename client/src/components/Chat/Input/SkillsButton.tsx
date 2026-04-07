import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface SkillsButtonProps {
  disabled?: boolean;
}

const SkillsButton = ({ disabled }: SkillsButtonProps) => {
  const localize = useLocalize();
  const [isOpen, setIsOpen] = useState(false);
  const [enabledSkills, setEnabledSkills] = useState<string[]>([]);
  const [availableSkills] = useState<string[]>(['code_review.md', 'documentation.md']);

  const handleSkillToggle = (skill: string) => {
    const newEnabledSkills = enabledSkills.includes(skill)
      ? enabledSkills.filter((s) => s !== skill)
      : [...enabledSkills, skill];
    setEnabledSkills(newEnabledSkills);
  };

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex size-9 items-center justify-center rounded-full p-1',
          'hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          isOpen && 'bg-surface-hover',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        aria-label={localize('com_ui_skills')}
      >
        <Zap className="size-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border-light bg-surface-secondary shadow-lg">
          <div className="p-3">
            <div className="mb-2 text-sm font-medium text-text-secondary">
              {localize('com_ui_skills_options')}
            </div>

            <div className="space-y-1">
              {availableSkills.map((skill) => (
                <div
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg px-2 py-2',
                    'transition-colors hover:bg-surface-hover',
                    enabledSkills.includes(skill) && 'bg-surface-active',
                  )}
                >
                  <span className="text-sm">
                    {skill
                      .replace('.md', '')
                      .replace(/[-_]/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                  <input
                    type="checkbox"
                    checked={enabledSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsButton;
