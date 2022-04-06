import { useGeneratorStore } from '../../store/generator';
import { Fragment, JSX } from 'preact';
import { Text } from 'preact-i18n';
import t from '../../Utility/i18n';

export default function RequestFlags() {
    const request = useGeneratorStore((state) => state.request);
    const setRequestFlag = useGeneratorStore((state) => state.setRequestFlag);

    switch (request.type) {
        case 'access':
            return (
                <Fragment>
                    <div id="data-portability" className="form-group">
                        <input
                            type="checkbox"
                            id="request-flags-data-portability"
                            className="request-flags form-element"
                            checked={request.data_portability}
                            onChange={(event: JSX.TargetedEvent<HTMLInputElement, Event>) =>
                                setRequestFlag({
                                    name: 'data_portability',
                                    value: (event.target as HTMLInputElement).checked,
                                })
                            }
                        />
                        <label htmlFor="request-flags-data-portability">
                            <Text id="data-portability" />
                        </label>
                    </div>
                </Fragment>
            );
        case 'erasure':
            return (
                <Fragment>
                    <div className="form-group">
                        <input
                            type="checkbox"
                            id="request-flags-erase-all"
                            className="request-flags form-element"
                            checked={request.erase_all}
                            onChange={(event: JSX.TargetedEvent<HTMLInputElement, Event>) =>
                                setRequestFlag({ name: 'erase_all', value: (event.target as HTMLInputElement).checked })
                            }
                        />
                        <label htmlFor="request-flags-erase-all">
                            <Text id="erase-all" />
                        </label>
                    </div>
                    {!request.erase_all ? (
                        <div className="form-group">
                            <textarea
                                id="request-erasure-data"
                                className="form-element"
                                onChange={(event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) =>
                                    setRequestFlag({
                                        name: 'erasure_data',
                                        value: (event.target as HTMLTextAreaElement).value,
                                    })
                                }
                                placeholder={t('erasure-data', 'generator')}>
                                {request.erasure_data}
                            </textarea>
                            <label htmlFor="request-erasure-data" className="sr-only">
                                <Text id="erasure-data" />
                            </label>
                        </div>
                    ) : null}
                </Fragment>
            );
    }

    return null;
}
