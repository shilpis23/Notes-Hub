

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Layout from "../common/Layout";
import Filters from "./Filters";
import NoteCard from "../common/NoteCard";

const SearchPanel = () => {
    const { notes, filterOptions, updateNote, showToast } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredNotes, setFilteredNotes] = useState(notes);
    const [selectedFilters, setSelectedFilters] = useState({
        subject: "All",
        course: "All",
        author: "All",
        rating: "All",
        uploadDate: "All",
        fileType: "All"
    });

    useEffect(() => {
        let result = notes;

        // Apply search query
        if (searchQuery) {
            result = result.filter(note =>
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.course.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filters
        if (selectedFilters.subject !== "All") {
            result = result.filter(note => note.subject === selectedFilters.subject);
        }

        if (selectedFilters.course !== "All") {
            result = result.filter(note => note.course === selectedFilters.course);
        }

        if (selectedFilters.author !== "All") {
            result = result.filter(note => note.author === selectedFilters.author);
        }

        if (selectedFilters.rating !== "All") {
            const minRating = parseInt(selectedFilters.rating.charAt(0));
            result = result.filter(note => note.rating >= minRating);
        }

        if (selectedFilters.fileType !== "All") {
            result = result.filter(note => note.fileType === selectedFilters.fileType);
        }

        setFilteredNotes(result);
    }, [searchQuery, selectedFilters, notes]);

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleLike = (noteId) => {
        updateNote(noteId, 'like');
    };

    const handleDownload = (noteId) => {
        updateNote(noteId, 'download');
    };

    const handleViewDetails = (note) => {
        showToast(`Viewing details for: ${note.title}`, 'info');
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:w-1/4">
                            <Filters
                                selectedFilters={selectedFilters}
                                onFilterChange={handleFilterChange}
                                filterOptions={filterOptions}
                            />
                        </div>

                        {/* Notes Grid */}
                        <div className="lg:w-3/4">
                            <div className="mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'} Found
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredNotes.map(note => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        onLike={handleLike}
                                        onDownload={handleDownload}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>

                            {filteredNotes.length === 0 && (
                                <div className="text-center py-12">
                                    <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                                    <h3 className="text-lg font-medium text-gray-900">No notes found</h3>
                                    <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SearchPanel;