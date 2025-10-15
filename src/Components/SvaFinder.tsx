import type { SupervisoryAuthority } from '../types/company';
import { render, Fragment, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useAppStore } from '../store/app';
import t from '../Utility/i18n';
import { fetchSvaDataBySlug } from '../Utility/companies';
import deepmerge from 'deepmerge';
import svas from '../Utility/sva-names.json';

type SvaFinderProps = {
    callback?: (sva?: SupervisoryAuthority) => void;
    style?: string;
    showTitle?: boolean;
    steps?: Record<string, Steps>;
};
type SvaFinderState = ({ step: Steps; question: string } | { step: undefined; question: undefined }) & {
    prev_state?: SvaFinderState;
    result: false | SvaSlug;
};

type SvaSlug = keyof typeof svas;
// For some reason, this is allowed but `Record<string, Step | SvaSlug>` is not. *shrug*
type Steps = { [name: string]: Steps | SvaSlug };

const steps: Record<string, Steps> = {
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
                // The previous other authorities for the evangelical churches have been merged into the BfD EKD, cf.
                // https://artikel91.eu/2025/01/02/nur-noch-eine-evangelische-aufsicht-dsbkd-aufgeloest/ and
                // https://datenschutz.ekd.de/2025/01/02/evangelische-datenschutzaufsicht/.
                ev: 'deekdbfd',
                kath: {
                    kathbay: 'dekathbayddsb',
                    kathnrw: 'dekathdsz',
                    kathmsw: 'dekathffdsz',
                    kathnd: 'dekathnordddsb',
                    kathod: 'dekathostddsb',
                },
                // TODO: A few other churches also have their own data protection authorities (very helpful source:
                // https://artikel91.eu/rechtssammlung/andere-religionsgemeinschaften/). Once we have added those, we
                // can defer to the regular state authorities for all other cases without their own autority.
                // Note: I am assuming that the responsible authority for other churches in Bavaria is debayldb as
                // churches tend to be Körperschaften des öffentlichen Rechts—I have not verified that.
                // Update: Actually, no. There is no responsible authority for other churches in Bavaria, see:
                // https://artikel91.eu/2023/10/18/datenschutzaufsichtsfreie-raeume-fuer-religionen-in-bayern/
                // Also, just because a church has set up their own authority, it doesn't mean that they are actually
                // responsible, cf. Jehovas Zeugen
                // (https://artikel91.eu/2025/10/15/fast-alle-landesdatenschutzaufsichten-sehen-sich-fuer-jehovas-zeugen-zustaendig/)
                // and SELK
                // (https://artikel91.eu/2023/01/05/vg-hannover-kassiert-datenschutzrecht-der-selk-entscheidungsgruende).
                // kirchesonst: {
                //     bawue: 'debawueldb',
                //     bay: 'debayldb',
                //     ber: 'deberlbdi',
                //     bra: 'debralda',
                //     bre: 'debrelfdi',
                //     hess: 'dehessbdi',
                //     hh: 'dehmbbfdi',
                //     mv: 'demvldi',
                //     nds: 'dendslfd',
                //     nrw: 'denrwldi',
                //     rlp: 'derlpbdi',
                //     saar: 'desaarudz',
                //     sachs: 'desaechsdsb',
                //     sa: 'desalbd',
                //     sh: 'deshuld',
                //     thue: 'detlfdi',
                // },
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
                'rundfunk-hr': 'derf',
                'rundfunk-mdr': 'derf',
                'rundfunk-ndr': 'derfndr',
                'rundfunk-rb': 'derfrb',
                'rundfunk-rbb': 'derfrbb',
                'rundfunk-sr': 'derf',
                'rundfunk-swr': 'derf',
                'rundfunk-wdr': 'derf',
                'rundfunk-zdf': 'derf',
                // Source: https://www.bfdi.bund.de/DE/Service/Kontakt/Kontaktfinder/kontaktfinder_node.html?cms_klvl2=272352&cms_klvl1=272342#kontaktfinderDown
                'rundfunk-beitragsservice': {
                    bawue: 'derf',
                    bay: 'derf',
                    ber: 'deberlbdi',
                    bra: 'debralda',
                    bre: 'debrelfdi',
                    hess: 'dehessbdi',
                    hh: 'derfndr',
                    mv: 'derfndr',
                    nds: 'derfndr',
                    nrw: 'derf',
                    rlp: 'derf',
                    saar: 'derf',
                    sachs: 'derf',
                    sa: 'derf',
                    sh: 'derfndr',
                    thue: 'derf',
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
};

export const SvaFinder = (props: SvaFinderProps) => {
    const initial_state: SvaFinderState = {
        step: props.steps?.country ?? steps.country,
        prev_state: undefined,
        question: t('country', 'sva-finder'),
        result: false,
    };
    const country = useAppStore((state) => state.country);

    const [state, setState] = useState<SvaFinderState>(initial_state);

    const selectOption = (option: string) => {
        const next_step = state.step![option];
        if (typeof next_step === 'object') {
            setState({
                step: next_step,
                prev_state: state,
                // It's probably possible to actually enforce type safety for this but that doesn't seem worth it.
                question: t(`${option}-q` as keyof typeof window.I18N_DEFINITION['sva-finder'], 'sva-finder'),
                result: false,
            });
        } else setState({ result: next_step, prev_state: state, step: undefined, question: undefined });
    };

    let content: JSX.Element;
    if (state.result) {
        if (props.callback) {
            fetchSvaDataBySlug(state.result).then((sva) => props.callback?.(sva ?? undefined));
            return <p>{t('loading-sva', 'sva-finder')}</p>;
        }

        content = (
            <p>
                {t('result', 'sva-finder')}
                <br />
                <a href={`${window.BASE_URL}supervisory-authority/${state.result}`}>{svas[state.result]}</a>
            </p>
        );
    } else {
        const entries = Object.keys(state.step!).reduce<Record<string, string>>((acc, val) => {
            // This is a little ugly conceptually but I really don't like storing the country names multiple times.
            acc[val] =
                t(val as keyof typeof window.I18N_DEFINITION['sva-finder'], 'sva-finder') ||
                t(val as keyof typeof window.I18N_DEFINITION.countries, 'countries');
            return acc;
        }, {});
        const sorted_keys = Object.keys(entries).sort((a, b) => {
            // For the countries, move the user's country to the top of the list.
            if (a === country) return -1;
            else if (b === country) return 1;

            // We have a few "Any other …" steps that need to be sorted last.
            const sortLastKeys = ['kirchesonst', 'private'];
            if (sortLastKeys.includes(a)) return 1;
            else if (sortLastKeys.includes(b)) return -1;

            // Otherwise, just sort alphabetically.
            return entries[a].localeCompare(entries[b]);
        });

        const options = sorted_keys.map((key) => (
            <div className="radio-wrapper">
                <label className={`radio-label${[country, 'private', 'kirchesonst'].includes(key) ? ' active' : ''}`}>
                    <input className="form-element" type="radio" onClick={() => selectOption(key)} />
                    {entries[key]}
                </label>
            </div>
        ));
        content = (
            <Fragment>
                <p style="margin-top: 0;">{state.question}</p>
                <div className="radio-group radio-group-vertical" style="max-height: 450px; overflow: auto;">
                    {options}
                </div>
            </Fragment>
        );
    }

    return (
        <div className="sva-finder box box-info" style={props.style}>
            {props.callback || props.showTitle === false ? '' : <h2>{t('sva-finder', 'sva-finder')}</h2>}

            {content}

            <div style="margin-top: 20px;">
                {state.prev_state && (
                    <button
                        className="button button-secondary button-small icon icon-arrow-left"
                        onClick={() => setState(state.prev_state!)}>
                        {t('back', 'sva-finder')}
                    </button>
                )}

                <button
                    className="button button-secondary button-small"
                    style="float: right;"
                    onClick={() => setState(initial_state)}>
                    {t('reset', 'sva-finder')}
                </button>
            </div>
            <div className="clearfix" />
        </div>
    );
};

(
    window as typeof window & {
        renderSvaFinder: (props?: { override?: Record<string, Steps>; showTitle?: boolean }) => void;
    }
).renderSvaFinder = (props) => {
    const stepsFromProps = deepmerge(steps, props?.override || {});
    document.querySelectorAll('.sva-finder').forEach((el) => {
        render(<SvaFinder showTitle={props?.showTitle} steps={stepsFromProps} />, el.parentElement!, el);
    });
};
