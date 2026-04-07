import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@librechat/client';
import { X, Code, Eye } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface SkillsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  skillContent: string;
}

const SkillsPopup = ({ isOpen, onClose, skillName, skillContent }: SkillsPopupProps) => {
  const localize = useLocalize();
  const [activeTab, setActiveTab] = useState<'view' | 'code'>('view');

  const formatSkillName = (name: string) => {
    return name
      .replace('.md', '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border-light pb-4">
          <DialogTitle className="text-lg font-semibold text-text-primary">
            {formatSkillName(skillName)}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded p-2 transition-colors hover:bg-surface-hover"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border-light">
          <button
            onClick={() => setActiveTab('view')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'view'
                ? 'border-b-2 border-primary text-text-primary'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Eye className="h-4 w-4" />
            {localize('com_ui_view')}
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'code'
                ? 'border-b-2 border-primary text-text-primary'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Code className="h-4 w-4" />
            {localize('com_ui_code')}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'view' ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: skillContent
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br>')
                    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/`(.+?)`/g, '<code>$1</code>')
                    .replace(/^- (.+)$/gm, '<li>$1</li>')
                    .replace(/<li>/g, '<ul><li>')
                    .replace(/<\/li>/g, '</li></ul>')
                    .replace(/<ul><\/ul>/g, ''),
                }}
              />
            </div>
          ) : (
            <pre className="overflow-auto rounded-lg bg-surface-secondary p-4 text-sm">
              <code className="text-text-primary">{skillContent}</code>
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsPopup;
