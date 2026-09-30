import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit2,
  ExternalLink,
  Send,
  Repeat2,
  Bookmark,
  Globe2,
} from 'lucide-react';
import { Post, ReactionType } from '../../types';
import { Avatar } from '../common/Avatar';
import { ReactionPicker, REACTION_CONFIG } from './ReactionPicker';
import { CommentSection } from './CommentSection';
import { postApi } from '../../api/post.api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (updated: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostDeleted,
  onPostUpdated,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [currentReaction, setCurrentReaction] = useState<ReactionType | null | undefined>(
    post.userReaction
  );
  const [likeCount, setLikeCount] = useState<number>(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState<number>(post.commentCount || 0);
  const [shareCount, setShareCount] = useState<number>(post.shareCount || 0);

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Edit post modal
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);

  // Image lightbox
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const isAuthor = user?.id === post.authorId;

  // Format date
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    return new Date(dateStr).toLocaleDateString();
  };

  const handleSelectReaction = async (type: ReactionType) => {
    setShowReactionPicker(false);
    try {
      const res = await postApi.toggleReaction(post.id, type);
      if (res.success && res.data) {
        setCurrentReaction(res.data.userReaction);
        setLikeCount(res.data.likeCount);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update reaction');
    }
  };

  const handleMainButtonClick = () => {
    if (currentReaction) {
      handleSelectReaction(currentReaction);
    } else {
      handleSelectReaction('LIKE');
    }
  };

  const handleShare = async () => {
    try {
      const res = await postApi.sharePost(post.id);
      if (res.success && res.data) {
        setShareCount(res.data.shareCount);
        success('Post link copied and shared to your feed!');
      }
    } catch (err: any) {
      error(err.message || 'Failed to share post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postApi.deletePost(post.id);
      success('Post deleted successfully');
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (err: any) {
      error(err.message || 'Failed to delete post');
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    try {
      const res = await postApi.updatePost(post.id, { content: editContent.trim() });
      if (res.success && res.data) {
        success('Post updated');
        setIsEditing(false);
        if (onPostUpdated) onPostUpdated(res.data);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  const activeReactionConfig = currentReaction ? REACTION_CONFIG[currentReaction] : null;

  return (
    <article className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.14)] duration-200">
      {/* Post Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/profile/${post.author?.id}`} className="flex items-start gap-3 group min-w-0">
            <Avatar
              src={post.author?.avatarUrl}
              name={post.author?.fullName || 'User'}
              size="md"
              className="ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2] dark:group-hover:text-[#70b5f9] group-hover:underline truncate">
                  {post.author?.fullName}
                </span>
                <span className="text-xs text-slate-400 font-normal">• 1st</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
                {post.author?.headline || 'LinkedIn Member'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                <span>{timeAgo(post.createdAt)}</span>
                <span>•</span>
                <Globe2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          </Link>

          {/* Post Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#282c31] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#1d2226] rounded-xl shadow-dropdown border border-[#e0dfdc] dark:border-[#383b40] py-1 z-30 animate-in fade-in-50">
                <button
                  onClick={() => {
                    setIsSaved(!isSaved);
                    setShowMenu(false);
                    success(isSaved ? 'Post removed from saved items' : 'Post saved to your items');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#282c31] cursor-pointer"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-slate-700 dark:fill-slate-200' : ''}`} />
                  {isSaved ? 'Unsave Post' : 'Save Post'}
                </button>

                {isAuthor && (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setIsEditing(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#282c31] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      Edit Post
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Post
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Body Content */}
      <div className="px-4 py-2 text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>

      {/* Tags */}
      {post.tags && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {post.tags
            .split(/[\s,]+/)
            .filter(Boolean)
            .map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline cursor-pointer"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
        </div>
      )}

      {/* Link attachment */}
      {post.linkUrl && (
        <div className="px-4 pb-3">
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-[#282c31] border border-slate-200 dark:border-[#383b40] text-xs text-[#0a66c2] dark:text-[#70b5f9] hover:bg-slate-100 dark:hover:bg-[#31373d] transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="truncate font-medium">{post.linkUrl}</span>
          </a>
        </div>
      )}

      {/* Image Attachment */}
      {post.imageUrl && (
        <div className="border-t border-b border-slate-100 dark:border-[#383b40] bg-slate-100 dark:bg-[#15191c]">
          <img
            src={post.imageUrl}
            alt="Post media"
            className="w-full object-cover max-h-[500px] cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setIsImageModalOpen(true)}
          />
        </div>
      )}

      {/* Engagement Counter Row */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-[#383b40]">
        <div className="flex items-center gap-1.5">
          <span className="flex -space-x-1">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-[10px]">👍</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-[10px]">👏</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 text-[10px]">❤️</span>
          </span>
          <span className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline cursor-pointer">{likeCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline transition-colors cursor-pointer"
          >
            {commentCount} comment{commentCount !== 1 ? 's' : ''}
          </button>
          <span>•</span>
          <span className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline cursor-pointer">
            {shareCount} repost{shareCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Action Buttons Toolbar with Fixed Reaction Hover */}
      <div className="px-2 py-1 flex items-center justify-around relative">
        {/* Like Button + Reaction Picker Wrapper */}
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setShowReactionPicker(false)}
        >
          {/* Reaction Picker Popup */}
          {showReactionPicker && (
            <div className="absolute -top-12 left-2 z-40 pb-2">
              <ReactionPicker
                currentReaction={currentReaction}
                onSelectReaction={handleSelectReaction}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleMainButtonClick}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeReactionConfig
                ? `${activeReactionConfig.color} hover:bg-slate-100 dark:hover:bg-[#282c31]`
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31]'
            }`}
          >
            <span className="text-base leading-none">
              {activeReactionConfig ? activeReactionConfig.emoji : '👍'}
            </span>
            <span>{activeReactionConfig ? activeReactionConfig.label : 'Like'}</span>
          </button>
        </div>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31] transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Comment</span>
        </button>

        {/* Repost Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31] transition-colors cursor-pointer"
        >
          <Repeat2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Repost</span>
        </button>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            success('Link copied to clipboard!');
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31] transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Send</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentCountChange={(delta) => setCommentCount((c) => Math.max(0, c + delta))}
        />
      )}

      {/* Edit Modal */}
      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Post">
          <div className="space-y-4">
            <textarea
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-[#383b40] bg-white dark:bg-[#282c31] text-slate-900 dark:text-white p-3 outline-none focus:border-[#0a66c2]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31] rounded-full cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-5 py-1.5 text-xs font-semibold bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Image Lightbox */}
      {isImageModalOpen && post.imageUrl && (
        <Modal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          title="Image Preview"
          maxWidth="2xl"
        >
          <div className="flex justify-center p-2">
            <img src={post.imageUrl} alt="Enlarged media" className="max-h-[80vh] object-contain rounded-lg" />
          </div>
        </Modal>
      )}
    </article>
  );
};
