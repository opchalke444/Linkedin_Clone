import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { refreshUser } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: true,
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userApi.addExperience({
        ...formData,
        endDate: formData.currentlyWorking ? null : formData.endDate || null,
      });
      await refreshUser();
      success('Work experience added!');
      onSuccess();
      onClose();
      setFormData({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: true,
        description: '',
      });
    } catch (err: any) {
      error(err.message || 'Failed to add experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Work Experience" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Company / Organization"
          placeholder="e.g. Swiggy, Razorpay, CRED, Flipkart, Infosys, Tata Digital"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />

        <Input
          label="Position / Title"
          placeholder="e.g. Principal Architect, Senior SDE, Staff Frontend Engineer"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />

        <Input
          label="Location"
          placeholder="e.g. Bengaluru, Karnataka (Hybrid) or Mumbai, Maharashtra"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />

          {!formData.currentlyWorking && (
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          )}
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.currentlyWorking}
            onChange={(e) => setFormData({ ...formData, currentlyWorking: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#0a66c2] focus:ring-[#0a66c2]"
          />
          I am currently working in this role
        </label>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Description / Responsibilities</label>
          <textarea
            rows={3}
            placeholder="Key projects, technologies used, and metrics achieved..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-[#383b40] dark:bg-[#282c31] dark:text-[#f3f2ef] p-3 text-xs text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#383b40]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Experience
          </Button>
        </div>
      </form>
    </Modal>
  );
};
