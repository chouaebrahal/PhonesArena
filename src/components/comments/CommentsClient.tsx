"use client"
import { Send, X , ArrowDown ,MessageCircle} from "lucide-react";
import {useState} from "react"
import { Comment } from "@/lib/types";
import { addComment } from "@/lib/queries";
import { useRouter } from "next/navigation";

const CommentsClient = ({ comments,postid }: { comments: Comment[],postid:number }) => {
    
  const [newComment, setNewComment] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [commentsState, setCommentsState] = useState<Comment[]>(comments);
  const router = useRouter();
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [showComments, setShowComments] = useState(true);
    const formatCommentDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      }
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsSubmittingComment(true);
        
  try {
    console.log(commentsState + "before");
    const newCommentData = await addComment(
      postid,               // WP Post ID
      newComment,           // textarea value
      newName,               // input value
      newEmail           // input value
    );
    
    if (newCommentData) {
      setCommentsState((prev) => [newCommentData, ...prev]);
      console.log(commentsState + "after");
      router.refresh();
    }
    
    
    setNewComment("");
    setNewName("");
    setNewEmail("");
  } catch (err) {
    console.error("Failed to add comment:", err);
  } finally {
    setIsSubmittingComment(false);
  }
    }
   
  return (
    <div className="container mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
        <button
          onClick={() => setShowComments(!showComments)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {showComments ? <X size={20} className="text-gray-500"  /> : <div className="flex gap-0.5"><MessageCircle size={20} className="text-gray-500" /> <span className="text-gray-500">{comments.length}</span></div> }
        </button>
      </div>

      {/* Comment Form */}
       <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <input type="hidden" value={postid} name="postid" />
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Add a comment
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="block w-full p-2 border border-[var(--primary)] rounded-[8px] text-sm font-medium text-gray-700 mb-2
             focus:outline-none  focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-150"
            placeholder="Share your thoughts..."
            disabled={isSubmittingComment}
          />
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            email (will not be published)
          </label>
          <input
            id="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            type="email"
            placeholder="email@gmail.com"
            className="block w-full p-2 border border-[var(--primary)] rounded-[8px] text-sm font-medium text-gray-700 mb-2
             focus:outline-none  focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-150"
          />

          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            your Name
          </label>
          <input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            type="text"
            placeholder="your name please"
            className="block w-full p-2 border border-[var(--primary)] rounded-[8px] text-sm font-medium text-gray-700 mb-2
             focus:outline-none  focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-150"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmittingComment}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
            <span>{isSubmittingComment ? "Posting..." : "Post Comment"}</span>
          </button>
        </div>
      </form>
      

      {/* Comments List */}
      {showComments &&
      (<div className="space-y-6">
        {commentsState.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          commentsState.map((comment) => (
            <div
              key={comment.id}
              className="flex space-x-3 pb-6 border-b border-gray-100 last:border-b-0"
            >
              <img
                src={comment.author.node.avatar.url || `/images/49.png`}
                alt={comment.author.node.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">
                    {comment.author.node.name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {formatCommentDate(comment.date)}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>)}
    </div>
  );
}

export default CommentsClient