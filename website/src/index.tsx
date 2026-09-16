import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import GsapBackground from './components/GsapBackground';
import SmoothScroll from './Effects/SmoothScroll';

import HomePage from './pages/HomePage';
import Patents from './pages/Patents';
import Research from './pages/Research';
import BooksPage from './pages/BooksPage';
import Aboutpage from './pages/Aboutpage';
import DepartmentPage from './pages/DepartmentPage';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SmoothScroll>
      <div className="app-shell">
        <GsapBackground />
        <Navbar onSearchToggle={() => setIsSearchOpen(true)} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onSearchOpen={() => setIsSearchOpen(true)} />} />
            <Route path="/patents" element={<Patents />} />
            <Route path="/papers" element={<Patents />} />
            <Route path="/research" element={<Research />} />
            <Route path="/indexed" element={<Research />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/department" element={<DepartmentPage />} />
            <Route path="/department/:id" element={<DepartmentPage />} />
            <Route path="/departments" element={<DepartmentPage />} />
            <Route path="/departments/:id" element={<DepartmentPage />} />
            <Route path="/institute/:id" element={<DepartmentPage />} />
            <Route path="/about" element={<Aboutpage />} />
          </Routes>
        </main>

        <Footer />

        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </SmoothScroll>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
