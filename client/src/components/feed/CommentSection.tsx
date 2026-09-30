import React, { useState } from 'react';
import { Send, CornerDownRight, Trash2 } from 'lucide-react';
import { Comment } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { postApi } from '../../api/post.api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
  onCommentCountChange?: (delta: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  initialComments = [],
  onCommentCountChange,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await postApi.addComment(postId, commentText.trim());
      if (res.success && res.data) {
        setComments((prev) => [res.data, ...prev]);
        setCommentText('');
        if (onCommentCountChange) onCommentCountChange(1);
        success('Comment posted');
      }
    } catch (err: any) {
      error(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await postApi.addComment(postId, replyText.trim(), parentId);
      if (res.success && res.data) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), res.data],
              };
            }
            return c;
          })
        );
        setReplyText('');
        setReplyingToId(null);
        if (onCommentCountChange) onCommentCountChange(1);
        success('Reply posted');
      }
    } catch (err: any) {
      error(err.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await postApi.deleteComment(postId, commentId);
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r.id !== commentId),
          }))
      );
      if (onCommentCountChange) onCommentCountChange(-1);
      success('Comment removed');
    } catch (err: any) {
      error(err.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-[#383b40] space-y-4">
      {/* Add Top-level Comment Input */}
      {user && (
        <form onSubmit={handleAddComment} className="flex gap-2.5 items-start">
          <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Add your thoughts or professional insights..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-full bg-slate-100/80 dark:bg-[#282c31] px-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200/80 dark:border-[#383b40] focus:bg-white dark:focus:bg-[#1d2226] focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!commentText.trim()}
              isLoading={isSubmitting}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Post
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            {/* Main comment */}
            <div className="flex gap-2.5 items-start group">
              <Avatar src={comment.author?.avatarUrl} name={comment.author?.fullName || 'User'} size="sm" />
              <div className="flex-1 rounded-2xl bg-slate-50 dark:bg-[#282c31] p-3 border border-slate-100/80 dark:border-[#383b40] relative">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                      {comment.author?.fullName}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {comment.author?.headline || 'Member'}
                    </p>
                  </div>
                  {user?.id === comment.authorId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition-opacity cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 mt-2 whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>

                <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <button
                    onClick={() => {
                      setReplyingToId(replyingToId === comment.id ? null : comment.id);
                      setReplyText('');
                    }}
                    className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CornerDownRight className="w-3 h-3" />
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Reply Input */}
            {replyingToId === comment.id && (
              <div className="ml-10 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Reply to ${comment.author?.fullName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 rounded-full bg-slate-100 dark:bg-[#282c31] px-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#383b40] outline-none focus:bg-white dark:focus:bg-[#1d2226] focus:border-[#0a66c2]"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim()}
                  isLoading={isSubmitting}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingToId(null)}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Nested Replies List */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-10 space-y-2 border-l-2 border-slate-200 dark:border-[#383b40] pl-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-2 items-start group">
                    <Avatar src={reply.author?.avatarUrl} name={reply.author?.fullName || 'User'} size="xs" />
                    <div className="flex-1 rounded-xl bg-slate-50 dark:bg-[#282c31] p-2.5 border border-slate-100 dark:border-[#383b40] relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                            {reply.author?.fullName}
                          </span>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500">{reply.author?.headline || 'Member'}</p>
                        </div>
                        {user?.id === reply.authorId && (
                          <button
                            onClick={() => handleDeleteComment(reply.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-0.5 transition-opacity cursor-pointer"
                            title="Delete reply"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
