

export const fetchWithRetry = (fetchFunction, n) => fetchFunction().catch(function(error) {
    if (n === 1) throw error;
    return fetchWithRetry(fetchFunction, n - 1);
});