import { useEffect, useReducer, useRef } from 'preact/hooks';

// Adapted after: https://usehooks-ts.com/react-hook/use-fetch

type Options = {
    enableCache?: boolean;

    fetchOptions?: RequestInit;
};

interface State<T> {
    data?: T;
    error?: Error;
}
type Cache<T> = { [url: string]: T };
type Action<T> = { type: 'loading' } | { type: 'fetched'; payload: T } | { type: 'error'; payload: Error };

export const useFetch = <T = unknown>(url?: string, options?: Options): State<T> => {
    const enable_cache = options?.enableCache !== false;
    const fetch_options = options?.fetchOptions;

    const cache = useRef<Cache<T>>({});

    // Used to prevent state update if the component is unmounted.
    const cancelRequest = useRef<boolean>(false);

    const initialState: State<T> = { error: undefined, data: undefined };

    const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
        switch (action.type) {
            case 'loading':
                return { ...initialState };
            case 'fetched':
                return { ...initialState, data: action.payload };
            case 'error':
                return { ...initialState, error: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(fetchReducer, initialState);

    useEffect(() => {
        if (!url) return;

        cancelRequest.current = false;

        const fetchData = async () => {
            dispatch({ type: 'loading' });

            if (enable_cache && cache.current[url]) {
                dispatch({ type: 'fetched', payload: cache.current[url] });
                return;
            }

            try {
                const response = await fetch(url, fetch_options);
                if (!response.ok) throw new Error(response.statusText);

                const data = (await response.json()) as T;
                if (enable_cache) cache.current[url] = data;
                if (cancelRequest.current) return;

                dispatch({ type: 'fetched', payload: data });
            } catch (error) {
                if (cancelRequest.current) return;

                dispatch({ type: 'error', payload: error as Error });
            }
        };

        void fetchData();

        return () => {
            cancelRequest.current = true;
        };
    }, [url, enable_cache, fetch_options]);

    return state;
};
