import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchFilters from './components/SearchFilters';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CreateProduct from './pages/CreateProduct';
import AdminPanel from './pages/AdminPanel';
import ProductDetail from './pages/ProductDetail';

function Home() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SearchFilters
          search={search} setSearch={setSearch}
          category={category} setCategory={setCategory}
        />
        <ProductGrid search={search} category={category} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
