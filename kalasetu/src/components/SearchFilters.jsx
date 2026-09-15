import { useTranslation } from 'react-i18next';

const CATEGORIES = ['All', 'Pottery', 'Textiles', 'Woodwork', 'Metalwork', 'Painting', 'Jewellery'];

export default function SearchFilters({ search, setSearch, category, setCategory }) {
  const { t } = useTranslation();

  return (
    <div className="ks-search-bar">
      <input
        type="text"
        placeholder={t('search_placeholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="ks-search-input"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="ks-select"
      >
        {CATEGORIES.map(c => (
          <option key={c} value={c}>
            {c === 'All' ? t('all_categories') : c}
          </option>
        ))}
      </select>
    </div>
  );
}
