import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { refreshUser } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: new Date().getFullYear() - 2,
    endYear: new Date().getFullYear() + 2,
    grade: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userApi.addEducation({
        ...formData,
        startYear: Number(formData.startYear),
        endYear: formData.endYear ? Number(formData.endYear) : null,
      });
      await refreshUser();
      success('Education record added!');
      onSuccess();
      onClose();
      setFormData({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startYear: new Date().getFullYear() - 2,
        endYear: new Date().getFullYear() + 2,
        grade: '',
        description: '',
      });
    } catch (err: any) {
      error(err.message || 'Failed to add education');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Education" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="College / University"
          placeholder="e.g. IIT Bombay, BITS Pilani, IIIT Hyderabad, IIT Delhi, NIT Trichy"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          required
        />

        <Input
          label="Degree"
          placeholder="e.g. B.Tech, Dual Degree (B.Tech + M.S.), M.Tech, B.E."
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          required
        />

        <Input
          label="Field of Study"
          placeholder="e.g. Computer Science, Artificial Intelligence"
          value={formData.fieldOfStudy}
          onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Year"
            type="number"
            value={formData.startYear}
            onChange={(e) => setFormData({ ...formData, startYear: Number(e.target.value) })}
            required
          />

          <Input
            label="End Year (or Expected)"
            type="number"
            value={formData.endYear}
            onChange={(e) => setFormData({ ...formData, endYear: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Grade / GPA (Optional)"
          placeholder="e.g. 3.9 GPA, First Class Honours"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#383b40]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Education
          </Button>
        </div>
      </form>
    </Modal>
  );
};
