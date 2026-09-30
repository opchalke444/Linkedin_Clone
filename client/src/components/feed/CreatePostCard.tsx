import React, { useState, useRef } from 'react';
import {
  Image,
  Calendar,
  Newspaper,
  X,
  Globe2,
  Smile,
  Hash,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Modal } from '../common/Modal';
import { postApi } from '../../api/post.api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface CreatePostCardProps {
  onPostCreated: () => void;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addTag = (tag: string) => {
    if (!content.includes(tag)) {
      setContent((prev) => `${prev} ${tag}`.trim());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;

    setIsSubmitting(true);
    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append('content', content.trim() || 'Shared media');
        formData.append('image', selectedImage);
        await postApi.createPost(formData);
      } else {
        await postApi.createPost({
          content: content.trim(),
        });
      }

      setContent('');
      removeImage();
      setIsModalOpen(false);
      success('Post published successfully!');
      onPostCreated();
    } catch (err: any) {
      error(err.message || 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const popularTags = ['#softwareengineering', '#career', '#tech', '#webdevelopment', '#ai'];

  return (
    <>
      <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-3 sm:p-4 space-y-3 transition-colors duration-200">
        {/* Top Input Bar */}
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatarUrl} name={user?.fullName || 'Me'} size="md" className="flex-shrink-0" />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 text-left px-4 py-3 rounded-full border border-slate-300 dark:border-[#383b40] bg-white dark:bg-[#282c31] hover:bg-slate-100 dark:hover:bg-[#31373d] text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            Start a post
          </button>
        </div>

        {/* Bottom 3 Quick Actions */}
        <div className="flex items-center justify-between pt-1">
          {/* Hidden File Picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#282c31] text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Image className="w-5 h-5 text-[#378fe9]" />
            <span className="hidden sm:inline">Media</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#282c31] text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-[#c37d16]" />
            <span className="hidden sm:inline">Event</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#282c31] text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Newspaper className="w-5 h-5 text-[#e06847]" />
            <span className="hidden sm:inline">Write article</span>
          </button>
        </div>
      </div>

      {/* LinkedIn Post Creation Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create a post"
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header with Author and Visibility */}
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatarUrl} name={user?.fullName || 'Me'} size="md" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName}</h4>
                <div className="flex items-center gap-1 px-2.5 py-0.5 mt-0.5 rounded-full border border-slate-300 dark:border-slate-600 text-[11px] font-semibold text-slate-600 dark:text-slate-300 w-fit">
                  <Globe2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>Anyone</span>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              autoFocus
              placeholder="What do you want to talk about?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent border-none outline-none resize-none leading-relaxed"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-[#383b40] max-h-64 inline-block">
                <img src={imagePreview} alt="Preview" className="max-h-64 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Hashtags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-[#383b40]">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center font-medium mr-1">
                <Hash className="w-3 h-3" /> Add hashtags:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] text-slate-600 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#383b40]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#282c31] text-slate-500 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors cursor-pointer"
                  title="Add photo"
                >
                  <Image className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => addTag('#career')}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#282c31] text-slate-500 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors cursor-pointer"
                  title="Add hashtag"
                >
                  <Hash className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31] rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={(!content.trim() && !selectedImage) || isSubmitting}
                  className={`px-5 py-1.5 text-xs font-semibold rounded-full text-white transition-colors cursor-pointer ${
                    (!content.trim() && !selectedImage) || isSubmitting
                      ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-[#0a66c2] hover:bg-[#004182]'
                  }`}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
