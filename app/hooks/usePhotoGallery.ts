import { useEffect, useRef, useState, useCallback } from "react"
import { getPhotos } from "../actions/getPhotos"
import { ApiResponse } from "../intefaces/apiResponse"
import { APP_CONFIG, RETRY_CONFIG } from "../constants/api"
import { Character } from "../intefaces/character"

export const usePhotoGallery = ({ initialData }: { initialData: Character[] }) => {
    const [photos, setPhotos] = useState<Character[]>(initialData);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const isFetchingRef = useRef(false);

    const handleDelete = (id: number) => {
        setPhotos((current) => current.filter((photo) => photo.id !== id));
    };


    const loadMorePhotos = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;

        isFetchingRef.current = true;
        setIsFetching(true);

        try {
            const nextPage = page + RETRY_CONFIG.RETRY_STEP;
            const response: ApiResponse = await getPhotos(nextPage);

            if (!response.results.length) {
                setHasMore(false);
                return;
            }

            setPhotos((prevPhotos) => {
                const existingIds = new Set(prevPhotos.map(p => p.id));
                const uniqueNewPhotos = response.results.filter(p => !existingIds.has(p.id));
                return [...prevPhotos, ...uniqueNewPhotos];
            });

            setPage(nextPage);
            setHasMore(!!response.info.next);

        } catch (error) {
            console.error("[Hook Error]: Failed to load more photos", error);
        } finally {
            isFetchingRef.current = false;
            setIsFetching(false);
        }
    }, [hasMore, page]);

    useEffect(() => {
        const isListTooShort = photos.length < APP_CONFIG.MIN_ITEMS_THRESHOLD;
        if (isListTooShort && hasMore && !isFetching) {
            loadMorePhotos();
        }
    }, [photos.length, hasMore, isFetching, loadMorePhotos]);

    return {
        photos,
        handleDelete,
        loadMorePhotos,
        hasMore,
        isFetching
    };
};
