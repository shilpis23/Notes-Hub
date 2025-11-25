const Filters = ({ selectedFilters, onFilterChange, filterOptions }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>

            <div className="space-y-6">
                {Object.keys(selectedFilters).map(filterType => (
                    <div key={filterType}>
                        <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                            {filterType === 'uploadDate' ? 'Upload Date' : filterType}
                        </h3>
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            value={selectedFilters[filterType]}
                            onChange={(e) => onFilterChange(filterType, e.target.value)}
                        >
                            {filterOptions[`${filterType}s`].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filters;