import { render, Component } from 'preact';
import PropTypes from 'prop-types';
import RequestGeneratorBuilder from './RequestGeneratorBuilder';
import { fakeEvt } from '../Utility/common';
import { VALID_REQUEST_TYPES } from '../Utility/requests';

export default class ActWidget extends Component {
    render() {
        return (
            <div className="box">
                <RequestGeneratorBuilder
                    ref={(o) => (this.generator = o)}
                    onInitialized={this.initializeGenerator}
                    render={({
                        RequestTypeChooserPlaceholder,
                        DynamicInputContainerPlaceholder,
                        SignatureInputPlaceholder,
                        ActionButtonPlaceholder,
                    }) => (
                        <>
                            {this.props.request_types.length > 1 ? (
                                <RequestTypeChooserPlaceholder request_types={this.props.request_types} />
                            ) : null}

                            {this.props.text_before_dynamic_input_container ? (
                                <p>{this.props.text_before_dynamic_input_container}</p>
                            ) : null}

                            <DynamicInputContainerPlaceholder
                                allowAddingFields={false}
                                allowRemovingFields={false}
                                allowChangingFieldDescriptions={false}
                            />

                            {this.props.transport_medium !== 'email' ? <SignatureInputPlaceholder /> : null}

                            <div style="float: right; margin-top: 10px;">
                                <ActionButtonPlaceholder />
                            </div>
                            <div className="clearfix" />
                        </>
                    )}
                />
            </div>
        );
    }

    initializeGenerator = () => {
        if (typeof this.props.company === 'string') this.generator.setCompanyBySlug(this.props.company);
        else if (typeof this.props.company === 'object') this.generator.setCompany(this.props.company);

        this.generator.handleTypeChange(fakeEvt(this.props.request_types[0]));
        this.props.transport_medium && this.generator.handleTransportMediumChange(fakeEvt(this.props.transport_medium));
    };

    static propTypes = {
        request_types: PropTypes.arrayOf(PropTypes.oneOf(VALID_REQUEST_TYPES)).isRequired,
        transport_medium: PropTypes.oneOf(['fax', 'email', 'letter']).isRequired,
        company: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        text_before_dynamic_input_container: PropTypes.string,
    };
}

window.renderActWidget = function (id = undefined, props = undefined) {
    props ||= window.props;
    const elems = id ? [document.getElementById(id)] : document.querySelectorAll('.act-widget');
    elems.forEach((el) => {
        render(<ActWidget {...props} />, el);
    });
};
