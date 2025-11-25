

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useToast from "../hooks/useToast";
import Layout from "../common/Layout";

const NoteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, updateNote, user, showToast } = useContext(AppContext);
    const { showToast: showNotification } = useToast();

    const [note, setNote] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const foundNote = notes.find(n => n.id === parseInt(id));
        if (foundNote) {
            setNote(foundNote);
        } else {
            showNotification('Note not found', 'error');
            navigate('/search');
        }
    }, [id, notes, navigate, showNotification]);

    const handleLike = () => {
        if (note) {
            updateNote(note.id, 'like');
            setNote(prev => ({
                ...prev,
                liked: !prev.liked,
                likes: prev.liked ? prev.likes - 1 : prev.likes + 1
            }));
        }
    };

    const handleDownload = () => {
        if (note) {
            updateNote(note.id, 'download');
            setNote(prev => ({
                ...prev,
                downloads: prev.downloads + 1
            }));
            showNotification(`Downloading: ${note.title}`, 'info');

            // Simulate download process
            setTimeout(() => {
                showNotification('Download completed!', 'success');
            }, 2000);
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) {
            showNotification('Please enter a comment', 'error');
            return;
        }

        const comment = {
            id: Date.now(),
            user: user?.name || 'Anonymous',
            text: newComment,
            replies: [],
            timestamp: new Date().toLocaleString()
        };

        setNote(prev => ({
            ...prev,
            comments: [...prev.comments, comment]
        }));

        setNewComment('');
        showNotification('Comment added successfully!', 'success');
    };

    const handleAddReply = (commentId) => {
        if (!replyText.trim()) {
            showNotification('Please enter a reply', 'error');
            return;
        }

        const reply = {
            id: Date.now(),
            user: user?.name || 'Anonymous',
            text: replyText,
            timestamp: new Date().toLocaleString()
        };

        setNote(prev => ({
            ...prev,
            comments: prev.comments.map(comment =>
                comment.id === commentId
                    ? { ...comment, replies: [...comment.replies, reply] }
                    : comment
            )
        }));

        setReplyText('');
        setReplyingTo(null);
        showNotification('Reply added successfully!', 'success');
    };

    const getFileIcon = (fileType) => {
        const icons = {
            PDF: 'fa-file-pdf',
            DOCX: 'fa-file-word',
            DOC: 'fa-file-word',
            PPT: 'fa-file-powerpoint',
            TXT: 'fa-file-alt',
            MD: 'fa-file-code'
        };
        return icons[fileType] || 'fa-file';
    };

    const getFileColor = (fileType) => {
        const colors = {
            PDF: 'text-red-500',
            DOCX: 'text-blue-500',
            DOC: 'text-blue-500',
            PPT: 'text-orange-500',
            TXT: 'text-gray-500',
            MD: 'text-purple-500'
        };
        return colors[fileType] || 'text-gray-500';
    };

    if (!note) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
                        <p className="text-gray-600">Loading note details...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link to="/search" className="text-gray-400 hover:text-gray-500">
                                <i className="fas fa-search"></i>
                                <span className="sr-only">Search</span>
                            </Link>
                        </li>
                        <li>
                            <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                        </li>
                        <li>
                            <span className="text-gray-500">Note Details</span>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 bg-opacity-20 mr-3`}>
                                        <i className={`fas ${getFileIcon(note.fileType)} mr-1 ${getFileColor(note.fileType)}`}></i>
                                        {note.fileType}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 bg-opacity-20">
                                        <i className="fas fa-star mr-1 text-yellow-300"></i>
                                        {note.rating}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
                                <p className="text-purple-200 text-lg mb-4">{note.description}</p>

                                <div className="flex flex-wrap items-center gap-4 text-purple-200">
                                    <div className="flex items-center">
                                        <i className="fas fa-user-graduate mr-2"></i>
                                        <span>By {note.author}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-calendar mr-2"></i>
                                        <span>Uploaded on {note.uploadDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-eye mr-2"></i>
                                        <span>{note.downloads} downloads</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-4 lg:mt-0 lg:ml-6">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${note.liked
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-black'
                                        }`}
                                >
                                    <i className={`fas fa-heart mr-2 ${note.liked ? 'fas' : 'far'}`}></i>
                                    {note.likes} Likes
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="flex items-center justify-center px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
                                >
                                    <i className="fas fa-download mr-2"></i>
                                    Download
                                </button>

                                <button className="flex items-center justify-center px-6 py-3 bg-white bg-opacity-20 text-black rounded-lg font-medium hover:bg-opacity-30 transition-all">
                                    <i className="fas fa-share-alt mr-2"></i>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50 border-b">
                            <div className="flex flex-wrap gap-2">
                                {note.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${activeTab === 'details'
                                    ? 'border-b-2 border-purple-500 text-purple-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <i className="fas fa-info-circle mr-2"></i>
                                Details
                            </button>
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${activeTab === 'comments'
                                    ? 'border-b-2 border-purple-500 text-purple-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <i className="fas fa-comments mr-2"></i>
                                Comments ({note.comments.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${activeTab === 'preview'
                                    ? 'border-b-2 border-purple-500 text-purple-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <i className="fas fa-eye mr-2"></i>
                                Preview
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <i className="fas fa-book mr-2 text-purple-600"></i>
                                            Subject Information
                                        </h3>
                                        <dl className="space-y-2">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-600">Subject</dt>
                                                <dd className="font-medium">{note.subject}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-600">Course</dt>
                                                <dd className="font-medium">{note.course}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-600">Author</dt>
                                                <dd className="font-medium">{note.author}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <i className="fas fa-chart-bar mr-2 text-purple-600"></i>
                                            Statistics
                                        </h3>
                                        <dl className="space-y-2">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-600">Rating</dt>
                                                <dd className="font-medium">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i
                                                                key={i}
                                                                className={`fas fa-star ${i < Math.floor(note.rating) ? 'text-yellow-400' : 'text-gray-300'} mr-1`}
                                                            ></i>
                                                        ))}
                                                        <span className="ml-1">({note.rating})</span>
                                                    </div>
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-600">Likes</dt>
                                                <dd className="font-medium">{note.likes}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-600">Downloads</dt>
                                                <dd className="font-medium">{note.downloads}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <i className="fas fa-file-alt mr-2 text-purple-600"></i>
                                        File Information
                                    </h3>
                                    <dl className="space-y-2">
                                        <div className="flex justify-between">
                                            <dt className="text-gray-600">File Type</dt>
                                            <dd className="font-medium flex items-center">
                                                <i className={`fas ${getFileIcon(note.fileType)} ${getFileColor(note.fileType)} mr-2`}></i>
                                                {note.fileType}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-600">Upload Date</dt>
                                            <dd className="font-medium">{note.uploadDate}</dd>
                                        </div>
                                        {note.fileSize && (
                                            <div className="flex justify-between">
                                                <dt className="text-gray-600">File Size</dt>
                                                <dd className="font-medium">{note.fileSize}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <i className="fas fa-align-left mr-2 text-purple-600"></i>
                                        Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">{note.description}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'comments' && (
                            <div className="space-y-6">
                                {/* Add Comment */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Add a Comment</h3>
                                    <div className="space-y-3">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Share your thoughts about this note..."
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleAddComment}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900">
                                        Comments ({note.comments.length})
                                    </h3>

                                    {note.comments.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <i className="fas fa-comments text-3xl mb-3 text-gray-300"></i>
                                            <p>No comments yet. Be the first to comment!</p>
                                        </div>
                                    ) : (
                                        note.comments.map(comment => (
                                            <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                            <i className="fas fa-user text-purple-600 text-sm"></i>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{comment.user}</p>
                                                            <p className="text-xs text-gray-500">{comment.timestamp}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-3">{comment.text}</p>

                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                                                    >
                                                        <i className="fas fa-reply mr-1"></i>
                                                        Reply
                                                    </button>
                                                </div>

                                                {/* Reply Input */}
                                                {replyingTo === comment.id && (
                                                    <div className="mt-3 ml-8 p-3 bg-gray-50 rounded-lg">
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            placeholder="Write a reply..."
                                                            rows="2"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                                        />
                                                        <div className="flex justify-end space-x-2 mt-2">
                                                            <button
                                                                onClick={() => setReplyingTo(null)}
                                                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleAddReply(comment.id)}
                                                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                                                            >
                                                                Post Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Replies */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="mt-3 ml-8 space-y-3">
                                                        {comment.replies.map(reply => (
                                                            <div key={reply.id} className="border-l-2 border-purple-200 pl-4 py-2">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <div className="flex items-center">
                                                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                                            <i className="fas fa-user text-blue-600 text-xs"></i>
                                                                        </div>
                                                                        <p className="font-semibold text-gray-900 text-sm">{reply.user}</p>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">{reply.timestamp}</p>
                                                                </div>
                                                                <p className="text-gray-700 text-sm">{reply.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'preview' && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <i className={`fas ${getFileIcon(note.fileType)} text-6xl ${getFileColor(note.fileType)} mb-4`}></i>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {note.fileType} Document Preview
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        This is a preview of the {note.fileType.toLowerCase()} document.
                                        Download the file to view the complete content.
                                    </p>

                                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 max-w-2xl mx-auto">
                                        <div className="text-left space-y-4">
                                            <h4 className="text-2xl font-bold text-gray-900">{note.title}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span>By {note.author}</span>
                                                <span>•</span>
                                                <span>{note.subject}</span>
                                                <span>•</span>
                                                <span>{note.course}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-4">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {note.description}
                                                </p>
                                            </div>
                                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                                <p className="text-yellow-700 text-sm">
                                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                                    This is a preview. Download the full document to access all content.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleDownload}
                                        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all inline-flex items-center"
                                    >
                                        <i className="fas fa-download mr-2"></i>
                                        Download Full Document
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Notes */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Notes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes
                            .filter(n => n.id !== note.id && (n.subject === note.subject || n.course === note.course))
                            .slice(0, 3)
                            .map(relatedNote => (
                                <div key={relatedNote.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900">{relatedNote.title}</h3>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {relatedNote.fileType}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedNote.description}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>By {relatedNote.author}</span>
                                        <Link
                                            to={`/note/${relatedNote.id}`}
                                            className="text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NoteDetails;