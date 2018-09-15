import preact from 'preact';
import IdData, {ID_DATA_CHANGE_EVENT, ID_DATA_CLEAR_EVENT} from "./Utility/IdData";
import Privacy, {PRIVACY_ACTIONS} from "./Utility/Privacy";
import t from 'Utility/i18n';
import {IntlProvider, MarkupText, Text} from "preact-i18n";
import DynamicInputContainer from "./Forms/DynamicInputContainer";

class IdDataControls extends preact.Component {
    constructor(props) {
        super(props);

        this.idData = new IdData();
        this.state = {
            id_data: [],
        };
        this.idData.getAll().then((id_data) => this.setState({id_data: id_data}));

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            return (
                <div id="id-data-controls-container">
                    <DynamicInputContainer key="id-data-controls" id="id-data-controls" onChange={this.handleChange} fields={this.state.id_data} title={t('saved-data', 'id-data-controls')} hasPrimary={false}>
                        <MarkupText id="saved-data-explanation" />
                        <div className="form-group">
                            <input type="checkbox" id="always-fill-in" className="form-element" checked={IdData.shouldAlwaysFill()} onChange={event => {
                                IdData.setAlwaysFill(!IdData.shouldAlwaysFill());
                            }}/>
                            <label for="always-fill-in"><Text id="always-fill-in" /></label>
                        </div>
                    </DynamicInputContainer>
                </div>
            );
        } else {
            return <div><MarkupText id="id-data-deactivated" /></div>;
        }
    }

    componentDidMount() {
        window.addEventListener(ID_DATA_CHANGE_EVENT, (event) => {
            this.idData.getAll().then((id_data) => this.setState({id_data: id_data}));
        });
        window.addEventListener(ID_DATA_CLEAR_EVENT, (event) => {
            this.idData.getAll().then((id_data) => this.setState({id_data: id_data}));
        });
    }

    handleChange(data) {
        this.idData.clear();
        this.idData.storeArray(data['id-data-controls']);
        this.setState({id_data: data['id-data-controls']});
    }
}

if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
    preact.render(<IntlProvider scope="id-data-controls" definition={I18N_DEFINITION}><IdDataControls/></IntlProvider>, null, document.getElementById('id-data-controls'));
}
