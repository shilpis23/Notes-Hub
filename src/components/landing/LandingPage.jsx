import { Link } from "react-router-dom";
const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-6 text-white">
                <div className="flex items-center">
                    <i className="fas fa-book-open text-2xl mr-2"></i>
                    <h1 className="text-2xl font-bold">NotesHub</h1>
                </div>
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-white rounded-md hover:bg-white hover:bg-opacity-10"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 text-sm font-medium text-purple-600 bg-white rounded-md hover:bg-gray-100"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Share and Study Notes
                </h1>
                <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
                    NotesHub is a platform where students and educators can share, discover, and collaborate on study materials.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/register"
                        className="px-8 py-3 text-lg font-medium text-purple-600 bg-white rounded-lg hover:bg-gray-100 shadow-lg text-center"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/search"
                        className="px-8 py-3 text-lg font-medium text-white bg-transparent border border-white rounded-lg hover:bg-white hover:bg-opacity-10 text-center"
                    >
                        Browse Notes
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Why Choose NotesHub?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-share-alt text-2xl text-purple-600"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Share Notes</h3>
                            <p className="text-gray-600">Upload and share your study materials with the community.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-search text-2xl text-purple-600"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Discover Resources</h3>
                            <p className="text-gray-600">Find high-quality notes from various subjects and courses.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-comments text-2xl text-purple-600"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Collaborate</h3>
                            <p className="text-gray-600">Discuss and improve notes with comments and feedback.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;