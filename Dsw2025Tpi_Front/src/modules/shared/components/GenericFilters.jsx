import Button from './Button';
import SearchBar from './SearchBar';

const GenericFilters = ({
    title,
    onCreate,
    createLabel = 'Crear',
    searchTerm,
    setSearchTerm,
    onSearch,
    status,
    setStatus,
    onStatusChange,
    statusOptions = [],
}) => {
    const handleStatusChange = (evt) => {
        if (onStatusChange) {
            onStatusChange(evt);
        } else if (setStatus) {
            setStatus(evt.target.value);
        }
    };

    return (
        <>
            {(title || onCreate) && (
                <div className='flex justify-between items-center mb-3'>
                    {title && <h1 className='text-2xl sm:text-3xl font-bold'>{title}</h1>}

                    {onCreate && (
                        <>
                            <Button
                                onClick={onCreate}
                                className='h-11 w-11 rounded-2xl sm:hidden flex items-center justify-center p-0'
                            >
                                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                    <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="currentColor"></path>
                                    <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="currentColor"></path>
                                </svg>
                            </Button>

                            <Button
                                className='hidden sm:block'
                                onClick={onCreate}
                            >
                                {createLabel}
                            </Button>
                        </>
                    )}
                </div>
            )}

            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={onSearch}
                        className='w-full sm:w-64'
                    />
                </div>
                {statusOptions.length > 0 && (
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className='text-base p-2 border border-gray-300 rounded-lg bg-white'
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </>
    );
};

export default GenericFilters;
