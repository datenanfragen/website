import { useGeneratorStore } from '../../store/generator';
import { Fragment } from 'preact';
import { Text } from 'preact-i18n';
import t from '../../Utility/i18n';

export function RequestFlags() {
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
                            onChange={(event) =>
                                setRequestFlag({
                                    name: 'data_portability',
                                    value: event.currentTarget.checked,
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
                            onChange={(event) =>
                                setRequestFlag({ name: 'erase_all', value: event.currentTarget.checked })
                            }
                        />
                        <label htmlFor="request-flags-erase-all">
                            <Text id="erase-all" />
                        </label>
                    </div>
                    {!request.erase_all && (
                        <div className="form-group">
                            <textarea
                                id="request-erasure-data"
                                className="form-element"
                                onChange={(event) =>
                                    setRequestFlag({
                                        name: 'erasure_data',
                                        value: event.currentTarget.value,
                                    })
                                }
                                placeholder={t('erasure-data', 'generator')}>
                                {request.erasure_data}
                            </textarea>
                            <label htmlFor="request-erasure-data" className="sr-only">
                                <Text id="erasure-data" />
                            </label>
                        </div>
                    )}

                    <div className="form-group">
                        <input
                            type="checkbox"
                            id="request-flags-include-objection"
                            className="request-flags form-element"
                            checked={request.include_objection}
                            onChange={(event) =>
                                setRequestFlag({ name: 'include_objection', value: event.currentTarget.checked })
                            }
                        />
                        <label htmlFor="request-flags-include-objection">
                            <Text id="include-objection" />
                        </label>
                    </div>
                    {request.include_objection && (
                        <div className="form-group">
                            <Text id="objection-reason-explanation" />
                            <textarea
                                id="request-objection-reason"
                                className="form-element"
                                onChange={(event) =>
                                    setRequestFlag({
                                        name: 'objection_reason',
                                        value: event.currentTarget.value.trim(),
                                    })
                                }
                                placeholder={t('objection-reason', 'generator')}>
                                {request.objection_reason}
                            </textarea>
                            <label htmlFor="request-objection-reason" className="sr-only">
                                <Text id="objection-reason" />
                            </label>
                        </div>
                    )}
                </Fragment>
            );
    }

    return null;
}
