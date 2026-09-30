import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    headline: user?.headline || '',
    location: user?.location || '',
    industry: user?.profile?.industry || '',
    preferredRole: user?.profile?.preferredRole || '',
    about: user?.profile?.about || '',
    portfolioUrl: user?.profile?.portfolioUrl || '',
    githubUrl: user?.profile?.githubUrl || '',
    linkedinUrl: user?.profile?.linkedinUrl || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userApi.updateProfile(formData);
      await refreshUser();
      success('Profile updated successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Professional Profile" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />

        <Input
          label="Headline"
          placeholder="e.g. Principal Architect | Distributed Systems & High-Scale Microservices"
          value={formData.headline}
          onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Location"
            placeholder="e.g. Bengaluru, Karnataka or Mumbai, Maharashtra"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Input
            label="Industry"
            placeholder="e.g. Software Engineering / FinTech / SaaS"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>

        <Input
          label="Target Role / Career Focus"
          placeholder="e.g. Principal Architect, Staff Frontend Engineer, Product Lead"
          value={formData.preferredRole}
          onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
          helperText="Helps match you with relevant job opportunities on LinkedIn"
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">About / Summary</label>
          <textarea
            rows={4}
            placeholder="Write a brief overview of your background, technical passions, and accomplishments..."
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-[#383b40] dark:bg-[#282c31] dark:text-[#f3f2ef] p-3 text-xs text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Portfolio / Website URL"
            placeholder="https://yourdomain.com"
            value={formData.portfolioUrl}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
          />

          <Input
            label="GitHub URL"
            placeholder="https://github.com/username"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#383b40]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
