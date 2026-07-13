export const formatApiDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Append 'Z' to treat the API date as UTC if it doesn't already have it
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    return date.toLocaleString();
};
