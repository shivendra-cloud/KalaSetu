import { useTranslation } from 'react-i18next';

// Match the ACTUAL categories used in product data
const CATEGORIES = [
  'All',
  'Pottery',
  'Textiles',
  'Painting',
  'Woodwork',
  'Metalwork',
  'Jewellery',
  'Handicraft',
];

export default function SearchFilters({ search, setSearch, category, setCategory }) {
  const { t } = useTranslation();

  return (
    <div className="ks-filters-wrap">
      <div className="ks-search-bar">
        <input
          type="text"
          placeholder={t('search_placeholder') || 'Search handcrafted treasures...'}
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
              {c === 'All' ? (t('all_categories') || 'All') : c}
            </option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="ks-category-pills">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`ks-pill ${category === c ? 'active' : ''}`}
          >
            {c === 'All' ? (t('all_categories') || 'All') : c}
          </button>
        ))}
      </div>
    </div>
  );
}
