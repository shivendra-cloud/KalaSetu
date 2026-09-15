import { useTranslation } from 'react-i18next';
import { FiSearch, FiSliders } from "react-icons/fi";

const categories = ["All", "Textiles", "Pottery", "Woodcraft", "Jewellery", "Paintings", "Home Decor"];

export default function SearchFilters({ category, setCategory, search, setSearch }) {
  const { t } = useTranslation();
  return (
    <section className="ks-discover" id="discover">
      <div className="ks-container">
        <div className="ks-toolbar">
          <div className="ks-search">
            <FiSearch className="ks-search-icon" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search_placeholder')} aria-label="Search products" />
          </div>
          <select className="ks-sort" aria-label="Sort products">
            <option>{t('featured')}</option>
            <option>{t('newest')}</option>
            <option>{t('price_low_to_high')}</option>
            <option>{t('price_high_to_low')}</option>
            <option>{t('top_rated')}</option>
          </select>
          <button className="ks-btn ks-btn-secondary" aria-label="Open advanced filters"><FiSliders /> Filters</button>
        </div>

        <div className="ks-filter-chips" role="group" aria-label="Product categories">
          {categories.map((item) => (
            <button key={item} className={`ks-filter-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)} aria-pressed={category === item}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}