// const { useContext } = React;
// const useToast = require('../hooks/useToast').default;

import { Link } from "react-router-dom";
import useToast from "../hooks/useToast";

const NoteCard = ({ note, onLike, onDownload, onViewDetails }) => {
    const { showToast } = useToast();

    const handleLike = () => {
        onLike(note.id);
        showToast(note.liked ? 'Removed from likes' : 'Added to likes', 'success');
    };

    const handleDownload = () => {
        onDownload(note.id);
        showToast(`Downloading: ${note.title}`, 'info');
    };

    return (
        <div className="note-card bg-white rounded-lg shadow-md overflow-hidden fade-in">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{note.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {note.fileType}
                    </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {note.subject}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {note.course}
                    </span>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span>By {note.author}</span>
                    <span className="mx-2">•</span>
                    <span>{note.uploadDate}</span>
                </div>

                <div className="mt-4 flex items-center">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <i
                                key={i}
                                className={`fas fa-star ${i < Math.floor(note.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            ></i>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({note.rating})</span>
                    </div>
                </div>

                <p className="mt-3 text-gray-600">{note.description}</p>

                <div className="mt-6 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-1 ${note.liked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                            <i className={`fas fa-heart ${note.liked ? 'fas' : 'far'}`}></i>
                            <span>{note.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500">
                            <i className="far fa-comment"></i>
                            <span>{note.comments.length}</span>
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-1 text-gray-500"
                        >
                            <i className="fas fa-download"></i>
                            <span>{note.downloads}</span>
                        </button>
                    </div>

                    <Link
                        to={`/note/${note.id}`}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;