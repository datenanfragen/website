import preact from 'preact';
import IdData from "./Utility/IdData";
import Privacy, {PRIVACY_ACTIONS} from "./Utility/Privacy";
import t from 'Utility/i18n';
import {IntlProvider, Text} from "preact-i18n";
import DynamicInputContainer from "./Forms/DynamicInputContainer";


class IdDataControls extends preact.Component {
    constructor(props) {
        super(props);

        this.idData = new IdData();
        this.state = {
            id_data: [],
            always_fill_in: true
        };
        this.idData.getAll().then((id_data) => this.setState({id_data: id_data}));

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        this.idData.getAll().then((id_data) => this.setState({id_data: id_data}));

        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            return (
                <div id="id-data-controls-container">
                    <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                        <DynamicInputContainer key="id-data-controls" id="id-data-controls" onChange={this.handleChange} fields={this.state.id_data} title={t('id-data', 'generator')} hasPrimary={false}>
                            <IntlProvider scope="id-data-controls" definition={I18N_DEFINITION}>
                                <div className="form-group">
                                    <input type="checkbox" id="always-fill-in" className="form-element" checked={this.state.always_fill_in} onChange={event => {
                                        this.setState({'always_fill_in': !this.state.always_fill_in});
                                    }}/>
                                    <label for="always-fill-in"><Text id="always-fill-in" /></label>
                                </div>
                            </IntlProvider>
                        </DynamicInputContainer>
                    </IntlProvider>
                </div>
            );
        } else {
            return <div><MarkupText id="id-data-deactivated" /></div>;
        }
    }

    handleChange(data) {
        this.idData.clear();
        this.idData.storeArray(data['id-data-controls']);
        this.setState({id_data: data['id-data-controls']});
    }
}

if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
    preact.render(<IntlProvider scope="id-data-controls" definition={I18N_DEFINITION}><IdDataControls/></IntlProvider>, null, document.getElementById('id-data-controls'))
}
