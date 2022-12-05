import { useEffect } from 'preact/hooks';
import { useGeneratorStoreApi } from '../../store/generator';

type GeneratorStoreTestInterfaceProps = {
    /**
     * If there is more than one generator on the page, there exists more than one context. To expose those, provide an id here.
     * @default 'default'
     */
    generatorId?: string;
};
type WindowWithGeneratorApi = typeof window & {
    generatorStoreApi: Record<string, ReturnType<typeof useGeneratorStoreApi>>;
};

// Expose the store for the test interface
export const GeneratorStoreTestInterface = (props: GeneratorStoreTestInterfaceProps) => {
    const generatorStoreApi = useGeneratorStoreApi();

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            (window as WindowWithGeneratorApi).generatorStoreApi = {
                ...(window as WindowWithGeneratorApi).generatorStoreApi,
                [props.generatorId || 'default']: generatorStoreApi,
            };
        }
    }, [generatorStoreApi, props.generatorId]);

    return <></>;
};
