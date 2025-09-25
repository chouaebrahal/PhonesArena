'use client'
// components/CommentsSection.jsx

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Phone } from '@/lib/types';

const CommentsSection = ({ comments = [], reviews = [], currentUser, onAddComment, onAddReview }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock current user (replace with actual auth)
  const user = currentUser || { id: '1', name: 'You', avatar: '/default-avatar.png' };

  // Filter published comments only
  const publishedComments = comments.filter(comment => comment.status === 'PUBLISHED');
  const publishedReviews = reviews;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment({
      content: newComment,
      userId: user.id,
      parentId: replyingTo?.id || null,
      phoneId: 'current-phone-id' // This should come from props
    });

    setNewComment('');
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleSubmitReply = (commentId) => {
    if (!replyContent.trim()) return;

    onAddComment({
      content: replyContent,
      userId: user.id,
      parentId: commentId,
      phoneId: 'current-phone-id'
    });

    setReplyingTo(null);
    setReplyContent('');
  };

  // Recursive function to render comment threads
  const renderCommentThread = (comments, parentId = null, depth = 0) => {
    const threadComments = comments.filter(comment => comment.parentId === parentId);
    
    return threadComments.map(comment => (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 md:ml-12' : ''} mb-6`}>
        <CommentItem 
          comment={comment} 
          onReply={() => setReplyingTo(replyingTo?.id === comment.id ? null : comment)}
          isReplying={replyingTo?.id === comment.id}
          replyContent={replyContent}
          onReplyChange={setReplyContent}
          onSubmitReply={() => handleSubmitReply(comment.id)}
          currentUser={user}
          depth={depth}
        />
        {/* Recursively render replies */}
        {renderCommentThread(comments, comment.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Community Feedback</h2>
        <p className="text-gray-600">Share your thoughts and experiences</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium transition-colors ${
            activeTab === 'comments'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('comments')}
        >
          Comments ({publishedComments.length})
        </button>
        <button
          className={`py-3 px-6 font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({publishedReviews.length})
        </button>
      </div>

      {/* Comment Section */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          {/* Add Comment Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {replyingTo && `Replying to ${replyingTo.user.name}`}
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {publishedComments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              renderCommentThread(publishedComments)
            )}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Add Review Button */}
          {!showReviewForm && (
            <div className="text-center">
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <ReviewForm 
              onSubmit={onAddReview}
              onCancel={() => setShowReviewForm(false)}
              currentUser={user}
            />
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {publishedReviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              publishedReviews.map(review => (
                <ReviewItem key={review.id} review={review} currentUser={user} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Comment Component
const CommentItem = ({ comment, onReply, isReplying, replyContent, onReplyChange, onSubmitReply, currentUser, depth }:Comment) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {comment.user.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
              {comment.isEdited && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Edited</span>}
            </div>
          </div>
        </div>
        
        {/* Moderation Badge */}
        {comment.reportCount > 0 && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            Reported ({comment.reportCount})
          </span>
        )}
      </div>

      {/* Comment Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{comment.content}</p>
      </div>

      {/* Comment Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like/Dislike */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                isLiked ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>👍</span>
              <span>{comment.likeCount + (isLiked ? 1 : 0)}</span>
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                isDisliked ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>👎</span>
              <span>{comment.dislikeCount + (isDisliked ? 1 : 0)}</span>
            </button>
          </div>

          {/* Reply Button */}
          {depth < 3 && ( // Limit nesting depth
            <button
              onClick={onReply}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {/* Report Button */}
        <button className="text-gray-400 hover:text-red-500 transition-colors" title="Report comment">
          ⚠️
        </button>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-4 pl-4 border-l-2 border-blue-200">
          <textarea
            value={replyContent}
            onChange={(e) => onReplyChange(e.target.value)}
            placeholder="Write your reply..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            rows="2"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => onReply(null)}
              className="px-4 py-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmitReply}
              disabled={!replyContent.trim()}
              className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Review Item Component
const ReviewItem = ({ review, currentUser }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [isNotHelpful, setIsNotHelpful] = useState(false);

  const handleHelpful = () => {
    setIsHelpful(!isHelpful);
    setIsNotHelpful(false);
  };

  const handleNotHelpful = () => {
    setIsNotHelpful(!isNotHelpful);
    setIsHelpful(false);
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {review.user.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{formatDistanceToNow(new Date(review.createdAt))} ago</span>
              {review.isVerifiedPurchase && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Verified Purchase</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Overall Rating */}
        <div className="text-right">
          <div className="flex text-lg">{renderStars(review.rating)}</div>
          <span className="text-sm text-gray-500">{review.rating}/5</span>
        </div>
      </div>

      {/* Review Title & Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {/* Detailed Ratings */}
      {review.designRating && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
          {review.designRating && (
            <div>
              <span className="text-gray-600">Design:</span>
              <div className="flex">{renderStars(review.designRating)}</div>
            </div>
          )}
          {review.performanceRating && (
            <div>
              <span className="text-gray-600">Performance:</span>
              <div className="flex">{renderStars(review.performanceRating)}</div>
            </div>
          )}
          {review.cameraRating && (
            <div>
              <span className="text-gray-600">Camera:</span>
              <div className="flex">{renderStars(review.cameraRating)}</div>
            </div>
          )}
          {review.batteryRating && (
            <div>
              <span className="text-gray-600">Battery:</span>
              <div className="flex">{renderStars(review.batteryRating)}</div>
            </div>
          )}
          {review.valueRating && (
            <div>
              <span className="text-gray-600">Value:</span>
              <div className="flex">{renderStars(review.valueRating)}</div>
            </div>
          )}
        </div>
      )}

      {/* Pros & Cons */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {review.pros.length > 0 && (
            <div>
              <h5 className="font-semibold text-green-600 mb-2">Pros</h5>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div>
              <h5 className="font-semibold text-red-600 mb-2">Cons</h5>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Review Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {review.usageDuration && (
            <span>Used for {review.usageDuration}</span>
          )}
          {review.isRecommended !== undefined && (
            <span className={review.isRecommended ? 'text-green-600' : 'text-red-600'}>
              {review.isRecommended ? '✓ Recommends' : '✗ Doesn\'t recommend'}
            </span>
          )}
        </div>

        {/* Helpful Votes */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Helpful?</span>
          <button
            onClick={handleHelpful}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              isHelpful ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span>👍</span>
            <span>{review.helpfulCount + (isHelpful ? 1 : 0)}</span>
          </button>
          <button
            onClick={handleNotHelpful}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              isNotHelpful ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span>👎</span>
            <span>{review.notHelpfulCount + (isNotHelpful ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Review Form Component (simplified version)
const ReviewForm = ({ onSubmit, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    pros: [''],
    cons: [''],
    isVerifiedPurchase: false,
    usageDuration: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
          <div className="flex text-2xl">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({...formData, rating: star})}
                className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Review title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Content */}
        <textarea
          placeholder="Share your experience..."
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows="4"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentsSection;