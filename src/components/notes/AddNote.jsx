import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Layout from '../common/Layout';
import useToast from '../hooks/useToast';



const AddNote = () => {
    const { notes, updateNotes, showToast } = useContext(AppContext);
    const { showToast: showNotification } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        course: '',
        description: '',
        fileType: 'PDF',
        tags: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState(null);

    const subjectOptions = ["Computer Science", "Mathematics", "History", "Chemistry", "Physics", "Biology", "Literature", "Economics"];
    const courseOptions = ["Web Development", "Calculus", "World History", "Organic Chemistry", "Data Structures", "Algorithms", "Microeconomics", "British Literature"];
    const fileTypeOptions = ["PDF", "DOCX", "PPT", "TXT", "MD"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                showNotification('File size should be less than 10MB', 'error');
                return;
            }

            // Check file type
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            const allowedExtensions = ['pdf', 'docx', 'doc', 'ppt', 'pptx', 'txt', 'md'];

            if (!allowedExtensions.includes(fileExtension)) {
                showNotification('Please upload a valid file (PDF, DOCX, PPT, TXT, MD)', 'error');
                return;
            }

            setFile(selectedFile);
            setFormData(prev => ({
                ...prev,
                fileType: fileExtension.toUpperCase()
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.subject || !formData.course || !formData.description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!file) {
            showNotification('Please select a file to upload', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create new note object
            const newNote = {
                id: Date.now(), // Simple ID generation
                title: formData.title,
                subject: formData.subject,
                course: formData.course,
                author: "Demo User", // From context user
                rating: 0,
                uploadDate: new Date().toISOString().split('T')[0],
                fileType: formData.fileType,
                likes: 0,
                downloads: 0,
                description: formData.description,
                comments: [],
                liked: false,
                fileName: file.name,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            // Update context with new note
            if (updateNotes) {
                updateNotes([...notes, newNote]);
            }

            showNotification('Note uploaded successfully!', 'success');

            // Reset form
            setFormData({
                title: '',
                subject: '',
                course: '',
                description: '',
                fileType: 'PDF',
                tags: ''
            });
            setFile(null);
            document.getElementById('file-upload').value = '';

            // Redirect to search page after successful upload
            setTimeout(() => {
                navigate('/search');
            }, 1000);

        } catch (error) {
            // showNotification('Failed to upload note. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const fileInput = document.getElementById('file-upload');
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(droppedFile);
            fileInput.files = dataTransfer.files;
            handleFileChange({ target: { files: dataTransfer.files } });
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <div className="flex items-center">
                            <i className="fas fa-plus-circle text-2xl text-white mr-3"></i>
                            <h1 className="text-2xl font-bold text-white">Upload New Note</h1>
                        </div>
                        <p className="text-purple-200 mt-1">Share your knowledge with the community</p>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Note Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Enter a descriptive title for your note"
                                    required
                                />
                            </div>

                            {/* Subject and Course */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    >
                                        <option value="">Select a subject</option>
                                        {subjectOptions.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                                        Course <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="course"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    >
                                        <option value="">Select a course</option>
                                        {courseOptions.map(course => (
                                            <option key={course} value={course}>{course}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Describe the content of your note, key topics covered, and any important information..."
                                    required
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload File <span className="text-red-500">*</span>
                                </label>

                                <div
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-purple-400'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-1 text-center">
                                        {file ? (
                                            <>
                                                <i className="fas fa-file text-3xl text-green-500"></i>
                                                <div className="text-sm text-gray-600">
                                                    <p className="font-medium text-green-600">{file.name}</p>
                                                    <p className="text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    <p className="text-xs text-gray-400">Click or drag to change file</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept=".pdf,.docx,.doc,.ppt,.pptx,.txt,.md"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PDF, DOCX, PPT, TXT, MD up to 10MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* File Type and Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-1">
                                        File Type
                                    </label>
                                    <select
                                        id="fileType"
                                        name="fileType"
                                        value={formData.fileType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        {fileTypeOptions.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="math, calculus, derivatives (comma separated)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Add relevant tags to help others find your note</p>
                                </div>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Upload Guidelines
                                </h3>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Ensure your notes are clear, organized, and easy to read</li>
                                    <li>• Only upload content you have created or have permission to share</li>
                                    <li>• Include relevant tags to help others discover your notes</li>
                                    <li>• File size should not exceed 10MB</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/search')}
                                    className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Uploading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <i className="fas fa-upload mr-2"></i>
                                            Upload Note
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddNote;