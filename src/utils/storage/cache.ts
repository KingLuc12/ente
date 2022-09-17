import { FACE_CROPS_CACHE, THUMB_CACHE } from 'constants/cache';
import { getCacheStorage } from 'services/cache/cacheStorageFactory';
import { logError } from 'utils/sentry';

export async function cached(
    cacheName: string,
    id: string,
    get: () => Promise<Blob>
): Promise<Blob> {
    const cache = await openCache(cacheName);
    const cacheResponse = await cache.match(id);

    let result: Blob;
    if (cacheResponse) {
        result = await cacheResponse.blob();
    } else {
        result = await get();

        try {
            await cache.put(id, new Response(result));
        } catch (e) {
            // TODO: handle storage full exception.
            console.error('Error while storing file to cache: ', id);
        }
    }

    return result;
}

export async function getBlobFromCache(
    cacheName: string,
    url: string
): Promise<Blob> {
    const cache = await openCache(cacheName);
    const response = await cache.match(url);

    return response.blob();
}

export async function openCache(cacheName: string) {
    try {
        return await getCacheStorage().open(cacheName);
    } catch (e) {
        logError(e, 'openCache failed'); // log and ignore
    }
}
export async function deleteCache(cacheName: string) {
    try {
        return await getCacheStorage().delete(cacheName);
    } catch (e) {
        logError(e, 'deleteCache failed'); // log and ignore
    }
}

export async function deleteAllCache() {
    try {
        await deleteCache(THUMB_CACHE);
        await deleteCache(FACE_CROPS_CACHE);
    } catch (e) {
        logError(e, 'deleteAllCache failed'); // log and ignore
    }
}
