import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { refreshUser } = useAuth();
  const { success, error } = useToast();

  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setIsSubmitting(true);
    try {
      await userApi.addSkill({ name: skillName.trim(), proficiency });
      await refreshUser();
      success(`Skill "${skillName.trim()}" added to your profile!`);
      onSuccess();
      onClose();
      setSkillName('');
    } catch (err: any) {
      error(err.message || 'Failed to add skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonSkillSuggestions = [
    'System Design',
    'React',
    'TypeScript',
    'Node.js',
    'Go',
    'PostgreSQL',
    'Kafka',
    'Microservices',
    'Docker',
    'Kubernetes',
    'AWS',
    'Python',
    'Machine Learning',
    'Generative AI',
    'Next.js',
    'UI/UX Design',
    'Cybersecurity',
    'Tailwind CSS',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add skill" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Skill Name"
          placeholder="e.g. React, PostgreSQL, Docker"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          required
        />

        {/* Suggestion tags */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Quick Suggestions</label>
          <div className="flex flex-wrap gap-1.5">
            {commonSkillSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSkillName(s)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-[#282c31] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] text-slate-700 dark:text-slate-300 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Proficiency Level</label>
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 dark:border-[#383b40] p-2.5 text-xs text-slate-900 dark:text-[#f3f2ef] bg-white dark:bg-[#282c31] outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20"
          >
            <option value="BEGINNER">Beginner (Foundational concepts)</option>
            <option value="INTERMEDIATE">Intermediate (Production experience)</option>
            <option value="ADVANCED">Advanced (Deep expertise & architecture)</option>
            <option value="EXPERT">Expert (Subject matter leader)</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#383b40]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Add Skill
          </Button>
        </div>
      </form>
    </Modal>
  );
};
