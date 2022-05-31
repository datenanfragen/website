import type { Except } from 'type-fest';
import { useGeneratorStore } from '../../store/generator';
import type { Company } from '../../types/company';
import t from '../../Utility/i18n';
import { SearchBar, SearchBarProps } from '../SearchBar';
import { useNewRequestModal } from './NewRequestButton';

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
