import React, { useState, useEffect } from 'react';
import * as Ariakit from '@ariakit/react';
import { PinIcon } from '@librechat/client';
import { Zap, ChevronRight, Search, Eye } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { dataService } from 'librechat-data-provider';
import { cn } from '~/utils';
import SkillsPopup from '~/components/Skills/SkillsPopup';

interface SkillsSubMenuProps {
  isSkillsPinned: boolean;
  setIsSkillsPinned: (value: boolean) => void;
  skillsMode: string;
  handleSkillsToggle: () => void;
}

const SkillsSubMenu = React.forwardRef<HTMLDivElement, SkillsSubMenuProps>(
  ({ isSkillsPinned, setIsSkillsPinned, skillsMode, handleSkillsToggle, ...props }, ref) => {
    const localize = useLocalize();
    const [searchQuery, setSearchQuery] = useState('');
    const [enabledSkills, setEnabledSkills] = useState<string[]>([]);
    const [availableSkills, setAvailableSkills] = useState<string[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<{ name: string; content: string } | null>(
      null,
    );
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
      // Fetch available skills from API
      const fetchSkills = async () => {
        try {
          const response = await dataService.getSkills();
          if (response?.skills) {
            setAvailableSkills(response.skills);
          }
        } catch (error) {
          console.error('Error fetching skills:', error);
          // Fallback to mock data if API fails
          setAvailableSkills(['code_review.md', 'documentation.md', 'polite.md']);
        }
      };
      fetchSkills();
    }, []);

    const menuStore = Ariakit.useMenuStore({
      focusLoop: true,
      showTimeout: 100,
      placement: 'right',
    });

    const isEnabled = skillsMode !== '' && skillsMode !== undefined;

    const filteredSkills = availableSkills.filter((skill) =>
      skill.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSkillToggle = (skill: string) => {
      const newEnabledSkills = enabledSkills.includes(skill)
        ? enabledSkills.filter((s) => s !== skill)
        : [...enabledSkills, skill];
      setEnabledSkills(newEnabledSkills);
    };

    const handleSkillClick = async (skill: string) => {
      try {
        const response = await dataService.generateSkillsPrompt({
          enabledSkills: [skill],
        });
        if (response?.prompt) {
          setSelectedSkill({
            name: skill,
            content: response.prompt,
          });
          setIsPopupOpen(true);
        }
      } catch (error) {
        console.error('Error fetching skill content:', error);
      }
    };

    return (
      <div ref={ref}>
        <Ariakit.MenuProvider store={menuStore}>
          <Ariakit.MenuItem
            {...props}
            hideOnClick={false}
            render={
              <Ariakit.MenuButton
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleSkillsToggle();
                }}
                onMouseEnter={() => {
                  if (isEnabled) {
                    menuStore.show();
                  }
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-surface-hover"
              />
            }
          >
            <div className="flex items-center gap-2">
              <Zap className="icon-md" aria-hidden="true" />
              <span>{localize('com_ui_skills')}</span>
              {isEnabled && <ChevronRight className="ml-auto h-3 w-3" aria-hidden="true" />}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSkillsPinned(!isSkillsPinned);
              }}
              className={cn(
                'rounded p-1 transition-all duration-200',
                'hover:bg-surface-tertiary hover:shadow-sm',
                !isSkillsPinned && 'text-text-secondary hover:text-text-primary',
              )}
              aria-label={isSkillsPinned ? 'Unpin' : 'Pin'}
            >
              <div className="h-4 w-4">
                <PinIcon unpin={isSkillsPinned} />
              </div>
            </button>
          </Ariakit.MenuItem>

          {isEnabled && (
            <Ariakit.Menu
              portal={true}
              unmountOnHide={true}
              className={cn(
                'animate-popover-left z-40 ml-3 mt-6 flex min-w-[300px] flex-col rounded-xl',
                'border border-border-light bg-surface-secondary shadow-lg',
              )}
            >
              <div className="px-2 py-1.5">
                <div className="mb-2 text-xs font-medium text-text-secondary">
                  {localize('com_ui_skills_options')}
                </div>

                {/* Search Bar */}
                <div className="mb-3 flex items-center gap-2 rounded-md bg-surface-tertiary px-2 py-1">
                  <Search className="h-3 w-3 text-text-secondary" />
                  <input
                    type="text"
                    placeholder={localize('com_ui_search_skills')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
                  />
                </div>

                {/* Skills List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredSkills.map((skill) => (
                    <Ariakit.MenuItem
                      key={skill}
                      hideOnClick={false}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleSkillToggle(skill);
                      }}
                      onDoubleClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleSkillClick(skill);
                      }}
                      className={cn(
                        'mb-1 flex items-center justify-between gap-2 rounded-lg px-2 py-2',
                        'cursor-pointer bg-surface-secondary text-text-primary outline-none transition-colors',
                        'hover:bg-surface-hover data-[active-item]:bg-surface-hover',
                        enabledSkills.includes(skill) && 'bg-surface-active',
                        'group relative',
                      )}
                    >
                      <span className="text-sm">
                        {skill
                          .replace('.md', '')
                          .replace(/[-_]/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleSkillClick(skill);
                          }}
                          className="rounded p-1 opacity-0 transition-opacity hover:bg-surface-tertiary group-hover:opacity-100"
                          title="View skill details"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <Ariakit.MenuItemCheck checked={enabledSkills.includes(skill)} />
                      </div>
                    </Ariakit.MenuItem>
                  ))}

                  {filteredSkills.length === 0 && (
                    <div className="py-2 text-center text-sm text-text-secondary">
                      {localize('com_ui_no_skills_found')}
                    </div>
                  )}
                </div>
              </div>
            </Ariakit.Menu>
          )}
        </Ariakit.MenuProvider>

        {/* Skills Popup */}
        {selectedSkill && (
          <SkillsPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            skillName={selectedSkill.name}
            skillContent={selectedSkill.content}
          />
        )}
      </div>
    );
  },
);

SkillsSubMenu.displayName = 'SkillsSubMenu';

export default React.memo(SkillsSubMenu);
