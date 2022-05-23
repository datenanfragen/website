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

    const [ConfirmNewRequestModal, showConfirmNewRequestModal] = useNewRequestModal((payload) =>
        setCompany(payload as Company).then(() => newRequestHook?.())
    );

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
        </div>
    );
};
