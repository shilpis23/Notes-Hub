// const { useState, useEffect, createContext } = React;

import { createContext, useEffect, useState } from "react";
import useToast from "../hooks/useToast";

const AppContext = createContext();

// Dummy data
const DUMMY_DATA = {
    notes: [
        {
            id: 1,
            title: "Introduction to React",
            subject: "Computer Science",
            course: "Web Development",
            author: "John Doe",
            rating: 4.5,
            uploadDate: "2023-10-15",
            fileType: "PDF",
            likes: 123,
            downloads: 532,
            description: "A comprehensive introduction to React concepts and components.",
            comments: [
                {
                    id: 1, user: "Alice", text: "Great notes! Very helpful.", replies: [
                        { id: 1, user: "John Doe", text: "Thanks, Alice!" }
                    ]
                },
                { id: 2, user: "Bob", text: "Could you add more examples?" }
            ],
            liked: false
        },
        {
            id: 2,
            title: "Calculus I - Derivatives",
            subject: "Mathematics",
            course: "Calculus",
            author: "Jane Smith",
            rating: 4.2,
            uploadDate: "2023-09-22",
            fileType: "PDF",
            likes: 89,
            downloads: 321,
            description: "Detailed notes on derivatives with examples and applications.",
            comments: [
                { id: 1, user: "Charlie", text: "Very clear explanations!" }
            ],
            liked: false
        },
        {
            id: 3,
            title: "World History - Ancient Civilizations",
            subject: "History",
            course: "World History",
            author: "Robert Johnson",
            rating: 4.7,
            uploadDate: "2023-11-05",
            fileType: "DOCX",
            likes: 156,
            downloads: 421,
            description: "Comprehensive overview of ancient civilizations from Mesopotamia to Rome.",
            comments: [],
            liked: false
        }
    ],
    filterOptions: {
        subjects: ["All", "Computer Science", "Mathematics", "History", "Chemistry", "Physics", "Biology"],
        courses: ["All", "Web Development", "Calculus", "World History", "Organic Chemistry", "Data Structures"],
        authors: ["All", "John Doe", "Jane Smith", "Robert Johnson", "Maria Garcia"],
        ratings: ["All", "4+ Stars", "3+ Stars", "2+ Stars"],
        uploadDates: ["All", "Last Week", "Last Month", "Last 3 Months"],
        fileTypes: ["All", "PDF", "DOCX", "PPT", "TXT"]
    }
};

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState(DUMMY_DATA.notes);
    const { showToast } = useToast();

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('notesHubUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('notesHubUser');
        showToast('Logged out successfully', 'info');
    };

    const updateNote = (noteId, action) => {
        setNotes(prevNotes =>
            prevNotes.map(note => {
                if (note.id === noteId) {
                    if (action === 'like') {
                        return {
                            ...note,
                            liked: !note.liked,
                            likes: note.liked ? note.likes - 1 : note.likes + 1
                        };
                    } else if (action === 'download') {
                        return {
                            ...note,
                            downloads: note.downloads + 1
                        };
                    }
                }
                return note;
            })
        );
    };

    const updateNotes = (newNotes) => {
        setNotes(newNotes);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('notesHubUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const contextValue = {
        user,
        login,
        logout,
        notes,
        updateNotes, // Add this line
        filterOptions: DUMMY_DATA.filterOptions,
        updateNote,
        showToast
    }
    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };