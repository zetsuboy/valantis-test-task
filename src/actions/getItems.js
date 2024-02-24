'use server'

import { fetchItems } from "@/utils/apiFetchHandlers";
import { fetchWithRetry } from "@/utils/fetchWithRetry";

export default async function getItems(offset, filters) {
    return await fetchWithRetry(() => fetchItems(offset, filters), 3)
}