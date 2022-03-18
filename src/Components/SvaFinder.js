import { render, Component } from 'preact';
import t from 'Utility/i18n';
import { fetchSvaDataBySlug } from '../Utility/companies';
import PropTypes from 'prop-types';
import deepmerge from 'deepmerge';

const steps = deepmerge(
    {
        country: {
            at: 'atdsb',
            be: 'beapd',
            bg: 'bgcpdp',
            hr: 'hrazop',
            cy: 'cydp',
            cz: 'czcuooz',
            dk: 'dkdi',
            ee: 'eeaki',
            fi: 'fitst',
            fr: 'frcnil',
            de: {
                bund: 'debfdi',
                'bund-telepost': 'debfdi',
                // The BfDI is also responsible for the job centres, except those with "authorised municipal carriers"
                // (https://www.bfdi.bund.de/SharedDocs/Downloads/DE/Flyer/DatenschutzImJobcenter.pdf?__blob=publicationFile&v=3).
                // Unfortunately, there's 104 of those, so we can't list them all (https://kommunale-jobcenter.de/uebersichtskarte/).
                'bund-jobcenter': 'debfdi',
                // Source: https://www.bfdi.bund.de/DE/Service/Kontakt/Kontaktfinder/kontaktfinder_node.html?cms_klvl2=272376&cms_klvl1=272344#kontaktfinderDown
                'bund-sueg': 'debfdi',
                // Source: https://www.bfdi.bund.de/DE/Service/Kontakt/Kontaktfinder/kontaktfinder_node.html?cms_klvl2=272350&cms_klvl1=272340#kontaktfinderDown
                // According to this, the BfDI is not responsible for some guild health insurers (Innungskrankenkassen).
                // This (https://www.bfdi.bund.de/DE/Buerger/Inhalte/GesundheitSoziales/Allgemein/Krankenkassen-Zust%C3%A4ndigkeit-BfDI.html?nn=302362)
                // lists the ones the BfDI is responsible for. As there are only six remaining in total (https://www.ikk.de/),
                // this allows us to determine which ones the BfDI is not responsible for.
                'bund-kk': 'debfdi',
                kirche: {
                    ev: 'deekdbfd',
                    kath: {
                        kathbay: 'dekathbayddsb',
                        kathnrw: 'dekathdsz',
                        kathmsw: 'dekathffdsz',
                        kathnd: 'dekathnordddsb',
                        kathod: 'dekathostddsb',
                        kathsonst: 'dekathverbdsb',
                    },
                },
                private: {
                    'private-de': {
                        bawue: 'debawueldb',
                        bay: {
                            oeff: 'debayldb',
                            priv: 'debaylda',
                        },
                        ber: 'deberlbdi',
                        bra: 'debralda',
                        bre: 'debrelfdi',
                        hess: 'dehessbdi',
                        hh: 'dehmbbfdi',
                        mv: 'demvldi',
                        nds: 'dendslfd',
                        nrw: 'denrwldi',
                        rlp: 'derlpbdi',
                        saar: 'desaarudz',
                        sachs: 'desaechsdsb',
                        sa: 'desalbd',
                        sh: 'deshuld',
                        thue: 'detlfdi',
                    },
                    'private-other': {
                        bawue: 'debawueldb',
                        bay: 'debaylda',
                        ber: 'deberlbdi',
                        bra: 'debralda',
                        bre: 'debrelfdi',
                        hess: 'dehessbdi',
                        hh: 'dehmbbfdi',
                        mv: 'demvldi',
                        nds: 'dendslfd',
                        nrw: 'denrwldi',
                        rlp: 'derlpbdi',
                        saar: 'desaarudz',
                        sachs: 'desaechsdsb',
                        sa: 'desalbd',
                        sh: 'deshuld',
                        thue: 'detlfdi',
                    },
                },
                rundfunk: {
                    'rundfunk-br': 'derf',
                    'rundfunk-dw': 'derfdw',
                    'rundfunk-dr': 'derf',
                    'rundfunk-hr': 'derfhr',
                    'rundfunk-mdr': 'derfmdr',
                    'rundfunk-ndr': 'derfndr',
                    'rundfunk-rb': 'derfrb',
                    'rundfunk-rbb': 'derfrbb',
                    'rundfunk-sr': 'derf',
                    'rundfunk-swr': 'derfswr',
                    'rundfunk-wdr': 'derf',
                    'rundfunk-zdf': 'derf',
                    // Source: https://www.bfdi.bund.de/DE/Service/Kontakt/Kontaktfinder/kontaktfinder_node.html?cms_klvl2=272352&cms_klvl1=272342#kontaktfinderDown
                    'rundfunk-beitragsservice': {
                        bawue: 'derfswr',
                        bay: 'derf',
                        ber: 'deberlbdi',
                        bra: 'debralda',
                        bre: 'debrelfdi',
                        hess: 'dehessbdi',
                        hh: 'derfndr',
                        mv: 'derfndr',
                        nds: 'derfndr',
                        nrw: 'derf',
                        rlp: 'derfswr',
                        saar: 'derf',
                        sachs: 'derfmdr',
                        sa: 'derfmdr',
                        sh: 'derfndr',
                        thue: 'derfmdr',
                    },
                },
            },
            gr: 'grdpa',
            hu: 'hunaih',
            ie: 'iedpc',
            it: 'itgpdp',
            lv: 'lvdvi',
            lt: 'ltada',
            lu: 'lucnpd',
            mt: 'mtidpc',
            nl: 'nlap',
            pl: 'plgiodo',
            pt: 'ptcnpd',
            ro: 'roanspdcp',
            sk: 'skunoou',
            si: 'siiprs',
            es: 'esaepa',
            se: 'sedi',
            gb: 'gbico',
            is: 'isdpa',
            li: 'lidss',
            no: 'nods',
            ch: 'chedoeb',
        },
    },
    window?.props?.override ? window.props.override : {}
);

const initial_state = {
    step: steps['country'],
    prev_state: null,
    question: t('country', 'sva-finder'),
    result: false,
};

export default class SvaFinder extends Component {
    constructor(props) {
        super(props);

        this.state = initial_state;
    }

    selectOption = (option) => {
        const next_step = this.state.step[option];
        if (typeof next_step === 'object') {
            this.setState((prev) => ({
                step: next_step,
                prev_state: prev,
                question: t(option + '-q', 'sva-finder'),
            }));
        } else this.setState((prev) => ({ result: next_step, prev_state: prev }));
    };

    render() {
        let content;

        if (this.state.result) {
            if (typeof this.props.callback === 'function') {
                fetchSvaDataBySlug(this.state.result).then((sva) => this.props.callback(sva));
                return <p>{t('loading-sva', 'sva-finder')}</p>;
            }

            content = (
                <p>
                    {t('result', 'sva-finder')}
                    <br />
                    <a href={BASE_URL + 'supervisory-authority/' + this.state.result}>{svas[this.state.result]}</a>
                </p>
            );
        } else {
            const entries = Object.keys(this.state.step).reduce((acc, val) => {
                // This is a little ugly conceptually but I really don't like storing the country names multiple times.
                acc[val] = t(val, 'sva-finder') || t(val, 'countries');
                return acc;
            }, {});
            const sorted_keys = Object.keys(entries).sort((a, b) => {
                // For the countries, move the user's country to the top of the list.
                if (steps.country[globals.country]) {
                    if (a === globals.country) return -1;
                    else if (b === globals.country) return 1;
                }

                // In the first step for Germany, "Any other public or private entity" has to be sorted last.
                if (a === 'private') return 1;
                else if (b === 'private') return -1;

                // Otherwise, just sort alphabetically.
                return entries[a].localeCompare(entries[b]);
            });

            const options = sorted_keys.map((key) => (
                <label className={'radio-label' + ([globals.country, 'private'].includes(key) ? ' active' : '')}>
                    <input className="form-element" onClick={() => this.selectOption(key)} />
                    {entries[key]}
                </label>
            ));

            content = [
                <p style="margin-top: 0;">{this.state.question}</p>,
                <div className="radio-group radio-group-vertical" style="max-height: 450px; overflow: auto;">
                    {options}
                </div>,
            ];
        }

        return (
            <div className="sva-finder box box-info" style={this.props.style}>
                {this.props.callback || window?.props?.override ? '' : <h2>{t('sva-finder', 'sva-finder')}</h2>}
                {content}
                <div style="margin-top: 20px;">
                    {this.state.prev_state && (
                        <button
                            className="button button-secondary button-small icon icon-arrow-left"
                            onClick={() => this.setState(this.state.prev_state)}>
                            {t('back', 'sva-finder')}
                        </button>
                    )}
                    <button
                        className="button button-secondary button-small"
                        style="float: right;"
                        onClick={() => this.setState(initial_state)}>
                        {t('reset', 'sva-finder')}
                    </button>
                </div>
                <div className="clearfix" />
            </div>
        );
    }

    static propTypes = {
        callback: PropTypes.func.isRequired,
        style: PropTypes.string.isRequired,
    };
}

window.renderSvaFinder = function () {
    document.querySelectorAll('.sva-finder').forEach((el) => {
        render(<SvaFinder />, el.parentElement, el);
    });
};

const svas = {
    atdsb: 'Österreichische Datenschutzbehörde',
    beapd: 'Autorite Protection Donnees de Belgique, Gegevensbeschermingsautoriteit van België',
    bgcpdp: 'Commission for Personal Data Protection Bulgaria',
    chedoeb: 'EDÖB – Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter',
    cydp: 'Γραφείο Επιτρόπου Δεδομένων Προσωπικού Χαρακτήρα (Personal Data Commissioner of Cyprus)',
    czcuooz: 'Úřad pro ochranu osobních údajů (Czech Office for Personal Data Protection)',
    debawueldb: 'Der Landesbeauftragte für den Datenschutz Baden-Württemberg',
    debaylda: 'Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)',
    debayldb: 'Der Bayerische Landesbeauftragte für den Datenschutz',
    deberlbdi: 'Berliner Beauftragte für Datenschutz und Informationsfreiheit',
    debfdi: 'Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit',
    debralda: 'Die Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg',
    debrelfdi: 'Die Landesbeauftragte für Datenschutz und Informationsfreiheit Bremen',
    deekdbfd: 'Der Beauftragte für den Datenschutz der EKD',
    dehessbdi: 'Der Hessische Beauftragte für Datenschutz und Informationsfreiheit',
    dehmbbfdi: 'Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit',
    dekathbayddsb: 'Diözesandatenschutzbeauftragter Bayerische Bistümer',
    dekathdsz: 'Katholisches Datenschutzzentrum (KdöR)',
    dekathffdsz: 'Katholisches Datenschutzzentrum Frankfurt (Mittel- und Südwestdeutsche Bistümer)',
    dekathnordddsb:
        'Der Diözesandatenschutzbeauftragte der (Erz-)Bistümer Hamburg, Hildesheim, Osnabrück und des Bischöflich Münsterschen Offizialats in Vechta i.O.',
    dekathostddsb: 'Diözesandatenschutzbeauftragter der ostdeutschen Bistümer',
    dekathverbdsb: 'Die Datenschutzbeauftragte des Verbandes der Diözesen Deutschlands',
    demvldi: 'Der Landesbeauftragte für Datenschutz und Informationsfreiheit Mecklenburg-Vorpommern',
    dendslfd: 'Die Landesbeauftragte für den Datenschutz Niedersachsen',
    denrwldi: 'Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen',
    derlpbdi: 'Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz',
    desaarudz: 'Unabhängiges Datenschutzzentrum Saarland',
    desaechsdsb: 'Der Sächsische Datenschutzbeauftragte',
    desalbd: 'Landesbeauftragter für den Datenschutz Sachsen-Anhalt',
    deshuld: 'Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein',
    detlfdi: 'Thüringer Landesbeauftragter für den Datenschutz und die Informationsfreiheit',
    derf: 'Der Rundfunkdatenschutzbeauftragte von BR, SR, WDR, Deutschlandradio und ZDF',
    derfdw: 'Rundfunkdatenschutzbeauftragter Deutsche Welle',
    derfhr: 'Datenschutzbeauftragter Hessischer Rundfunk',
    derfmdr: 'Rundfunkbeauftragter für den Datenschutz beim MDR',
    derfndr: 'Rundfunkdatenschutzbeauftragter Norddeutscher Rundfunk',
    derfrb: 'Datenschutzbeauftragte Radio Bremen',
    derfrbb: 'Datenschutzbeauftragte Rundfunk Berlin-Brandenburg',
    derfswr: 'Rundfunkbeauftragter für den Datenschutz beim Südwestrundfunk',
    dkdi: 'Datatilsynet (Data Inspectorate of Denmark)',
    eeaki: 'Andmekaitse Inspektsioon (Estonian Data Protection Inspectorate)',
    esaepa: 'Agencia Española de Protección de Datos (Spanish Agency for Data Protection)',
    fitst: 'Tietosuojavaltuutetun toimisto (Office of the Data Protection Ombudsman of Denmark)',
    frcnil: "Commission Nationale de l'Informatique et des Libertés – CNIL (French National Commission on Informatics and Liberty)",
    gbico: 'The Information Commissioner’s Office',
    grdpa: 'Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (Hellenic Data Protection Authority)',
    hrazop: 'Agencija za zaštitu osobnih podataka (Croatian Personal Data Protection Agency)',
    hunaih: 'Nemzeti Adatvédelmi és Információszabadság Hatóság (Hungarian National Authority for Data Protection and Freedom of Information)',
    iedpc: 'Irish Data Protection Commission',
    isdpa: 'Persónuvernd (Icelandic Data Protection Authority)',
    itgpdp: 'Garante per la protezione dei dati personali (Italian Data Protection Authority)',
    lidss: 'Datenschutzstelle (DSS) Fürstentum Liechtenstein',
    ltada: 'Valstybinė duomenų apsaugos inspekcija (State Data Protection Inspectorate of Lithuania)',
    lucnpd: 'Commission nationale pour la protection des données (National Commission for Data Protection, Grand-Duchy of Luxembourg)',
    lvdvi: 'Datu valsts inspekcija (Data State Inspectorate of Latvia)',
    mtidpc: 'Office of the Information and Data Protection Commissioner of Malta',
    nlap: 'Autoriteit Persoonsgegevens (Dutch Data Protection Authority)',
    nods: 'Datatilsynet (Norwegian Data Protection Authority)',
    plgiodo:
        'GIODO – Biuro Generalnego Inspektora Ochrony Danych Osobowych (The Bureau of the Inspector General for the Protection of Personal Data of Poland)',
    ptcnpd: 'CNPD – Comissão Nacional de Protecção de Dados',
    roanspdcp:
        'Autoritatea Naţională de Supraveghere a Prelucrării Datelor cu Caracter Personal (The National Supervisory Authority For Personal Data Processing of Romania)',
    sedi: 'Datainspektionen (Swedish Data Protection Authority)',
    siiprs: 'Informacijski pooblaščenec (Information Commissioner of the Republic of Slovenia)',
    skunoou:
        'Úrad na ochranu osobných údajov Slovenskej republiky (Office for Personal Data Protection of the Slovak Republic)',
};
