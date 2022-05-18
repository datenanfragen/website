import t from '../../Utility/i18n';
import { useGeneratorStore } from '../../store/generator';
import { SearchBarProps, SearchBar } from '../SearchBar';
import type { Except } from 'type-fest';
import { useNewRequestModal } from './NewRequestButton';
import { Company } from '../../types/company.d';

type CompanySelectorProps = { newRequestHook: () => void } & Partial<Except<SearchBarProps, 'anchorize' | 'index'>>;

export const CompanySelector = (props: CompanySelectorProps) => {
    const setCompany = useGeneratorStore((state) => state.setCompany);
    const request_sent = useGeneratorStore((state) => state.request.sent);
    const company = useGeneratorStore((state) => state.current_company);

    const { newRequestHook } = props;

    const [ConfirmNewRequestModal, showConfirmNewRequestModal] = useNewRequestModal((payload) => {
        setCompany(payload as Company).then(() => {
            if (newRequestHook) newRequestHook();
        });
    });

    return (
        <div className="search">
            <ConfirmNewRequestModal />
            <SearchBar
                id="aa-search-input"
                index="companies"
                onAutocompleteSelected={(_, hit) => {
                    if (company && !request_sent) showConfirmNewRequestModal(hit.document);
                    else setCompany(hit.document);
                }}
                placeholder={t('select-company', 'generator')}
                debug={false}
                {...props}
            />
            {/* For some reason, autocomplete.js completely freaks out if it is wrapped in any tag at all and there isn't *anything at all* after it (only in the generator, though). As a workaround, we just use a space. We are counting on #24 anyway… */}{' '}
        </div>
    );
};
