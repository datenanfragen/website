// eslint-disable-next-line no-unused-vars
import { Text } from 'preact-i18n';
import t from '../Utility/i18n';

import { clearUrlParameters } from './browser';

import { SearchBar } from '../Components/SearchBar';
import RequestTypeChooser from '../Components/Generator/RequestTypeChooser';
import SignatureInput from '../Components/Generator/SignatureInput';
import ActionButton from '../Components/Generator/ActionButton';
import RequestForm from '../Components/Generator/RequestForm';
import CompanyWidget from '../Components/Generator/CompanyWidget';
import DynamicInputContainer from '../Components/Generator/DynamicInputContainer';
import RecipientInput from '../Components/Generator/RecipientInput';
import TransportMediumChooser from '../Components/Generator/TransportMediumChooser';

/* eslint-disable react/display-name */
const replacer_factory = (that) => ({
    ActionButtonPlaceholder: (props) => (
        <ActionButton
            transport_medium={that.state.request.transport_medium}
            blob_url={that.state.blob_url}
            email={that.state.request.email}
            letter={that.letter}
            download_filename={that.state.download_filename}
            download_active={that.state.download_active}
            ready={that.state.ready}
            done={that.state.request.done}
            onSuccess={() => {
                that.storeRequest();
                that.setState((prev) => {
                    prev.request.done = true;
                    return prev;
                });
            }}
            {...props}
        />
    ),
    NewRequestButtonPlaceholder: (props) => (
        <button
            className="button button-secondary"
            id="new-request-button"
            onClick={() => {
                if (!that.state.request.done) that.confirmNewRequest();
                else
                    that.newRequest().then(() => {
                        // We are in batch mode, move to the next company.
                        if (that.state.batch?.length > 0) {
                            that.setCompanyBySlug(that.state.batch.shift()).then(that.renderLetter);
                        } else that.renderLetter();
                    });
            }}
            {...props}>
            <Text id={that.state.batch?.length > 0 ? 'next-request' : 'new-request'} />
        </button>
    ),
    CompanySelectorPlaceholder: (props) => (
        <div className="search">
            <SearchBar
                id="aa-search-input"
                index="companies"
                onAutocompleteSelected={that.handleAutocompleteSelected}
                placeholder={t('select-company', 'generator')}
                debug={false}
                {...props}
            />
            {/* For some reason, autocomplete.js completely freaks out if it is wrapped in any tag at all and there isn't *anything at all* after it (only in the generator, though). As a workaround, we just use a space. We are counting on #24 anyway… */}{' '}
        </div>
    ),
    RequestFormPlaceholder: (props) => (
        <RequestForm
            onAddField={that.handleAddField}
            onRemoveField={that.handleRemoveField}
            onSetPrimaryAddress={that.handleSetPrimaryAddress}
            onInputChange={that.handleInputChange}
            onChange={that.handleRequestChange}
            onTypeChange={that.handleTypeChange}
            onLetterChange={that.handleCustomLetterPropertyChange}
            onTransportMediumChange={that.handleTransportMediumChange}
            request_data={that.state.request}
            fillFields={that.state.fill_fields}
            fillSignature={that.state.fill_signature}
            onLetterTemplateChange={that.handleCustomLetterTemplateChange}
            {...props}>
            {that.state.suggestion ? (
                <CompanyWidget
                    company={that.state.suggestion}
                    onRemove={() => {
                        that.setState((prev) => {
                            prev.suggestion = undefined;
                            prev.request.recipient_runs = [];
                            prev.request.language = LOCALE;

                            return prev;
                        });
                        clearUrlParameters();
                    }}
                />
            ) : (
                ''
            )}
        </RequestForm>
    ),
    DynamicInputContainerPlaceholder: (props) => (
        <DynamicInputContainer
            key="id_data"
            id="id_data"
            onAddField={that.handleAddField}
            onRemoveField={that.handleRemoveField}
            onSetPrimaryAddress={that.handleSetPrimaryAddress}
            onChange={that.handleInputChange}
            fields={that.state.request.id_data}
            {...props}
        />
    ),
    SignatureInputPlaceholder: (props) => (
        <SignatureInput
            id="signature"
            width={428}
            height={190}
            onChange={that.handleInputChange}
            value={that.state.request.signature}
            {...props}
        />
    ),
    RequestTypeChooserPlaceholder: (props) => (
        <RequestTypeChooser onTypeChange={that.handleTypeChange} current={that.state.request.type} {...props} />
    ),
    RecipientInputPlaceholder: (props) => (
        <RecipientInput
            onAddressChange={(e) => that.handleInputChange({ recipient_address: e.target.value })}
            onEmailChange={(e) => that.handleInputChange({ email: e.target.value })}
            transportMedium={that.state.request.transport_medium}
            recipientAddress={that.state.request.recipient_address}
            email={that.state.request.email}
            {...props}
        />
    ),
    TransportMediumChooserPlaceholder: (props) => (
        <TransportMediumChooser
            transportMedium={that.state.request.transport_medium}
            onChange={that.handleTransportMediumChange}
            {...props}
        />
    ),
});
/* eslint-enable react/display-name */

export default replacer_factory;
