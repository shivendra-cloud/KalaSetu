import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchFilters from "./components/SearchFilters";
import ProductGrid from "./components/ProductGrid";
import CreateProduct from "./pages/CreateProduct";
import Footer from "./components/Footer";
import "./styles.css";

function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <>
      <Navbar />
      <main className="ks-page">
        <Hero />
        <SearchFilters search={search} setSearch={setSearch} category={category} setCategory={setCategory} />
        <ProductGrid search={search} category={category} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("kalasetu-theme");
    if (savedTheme) {
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<><Navbar /><CreateProduct /><Footer /></>} />
      </Routes>
    </BrowserRouter>
  );
}