import React, { useState, useEffect } from 'react';

// Minimal child component to demonstrate props usage
const MenuItem = ({ item, isFavorite, onToggleFavorite }) => (
  <div style={{ background: '#1f2024', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding:  '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <h3 style={{ margin: '0', color: '#f3f4f6', fontSize: '16px' }}>{item.title}</h3>
      <span style={{ color: '#f0b429', fontWeight: '700' }}>€{item.price}</span>
    </div>
    <p style={{ margin: '0 0 0.5rem', color: '#b5bac3', fontSize: '13px' }}>{item.description}</p>
    <button onClick={() => onToggleFavorite(item.id)} style={{ width: '100%', padding: '8px', background: isFavorite ? '#12b981' : '#202127', color: '#fff', border: `1px solid ${isFavorite ? '#12b981' : 'rgba(255,255,255,0.14)'}`, borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
      {isFavorite ? '❤️ Në të preferuara' : '🤍 Shto'}
    </button>
  </div>
);

const MenuFilter = () => {
  const [filter, setFilter] = useState('gjitha');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const mockMenu = [
      { id: 1, title: 'Bruschetta me Domate', category: 'fillestar', description: 'Bagetë, domate, borzilok', price: '5. 50' },
      { id:  2, title: 'Sallatë Ceasar', category: 'fillestar', description: 'Marule, parmixhan, croutons', price: '6.90' },
      { id: 3, title: 'Risotto me Kërpudha', category: 'kryesor', description: 'Arborio, kërpudha, parmixhan', price: '10.90' },
      { id: 4, title: 'Fileto Viçi', category: 'kryesor', description: 'Fileto me salcë piper', price: '14.50' },
      { id: 5, title: 'Tiramisu Klasik', category: 'ëmbëlsira', description: 'Mascarpone, biskota, espresso', price: '4.90' },
      { id: 6, title: 'Limonadë e Freskët', category: 'pije', description: 'Limona, mente, akull', price: '2.50' }
    ];

    setTimeout(() => {
      setMenuItems(mockMenu);
      setIsLoading(false);
    }, 300);
  }, []);

  const filteredItems = menuItems. filter(item => {
    const matchesCategory = filter === 'gjitha' || item.category === filter;
    const matchesSearch = searchTerm === '' || item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('gourmet_menu_filter', filter);
    localStorage.setItem('gourmet_favorites', JSON.stringify(favorites));
    alert(`✅ Preferencat e ruajtura! `);
  };

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
        🍽️ Filtri i Menysë (React)
      </h2>

      <form onSubmit={handleSubmit} style={{ marginBottom:  '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display:  'block', marginBottom: '0.5rem', fontWeight: '600' }}>🔍 Kërko: </label>
          <input type="text" placeholder="Kërko në meny..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px', background: '#202127', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '6px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>📂 Kategoria:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '100%', padding: '10px', background: '#202127', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '6px', cursor: 'pointer' }}>
            <option value="gjitha">Të gjitha</option>
            <option value="fillestar">Fillestare</option>
            <option value="kryesor">Kryesore</option>
            <option value="ëmbëlsira">Ëmbëlsira</option>
            <option value="pije">Pije</option>
          </select>
        </div>
        <button type="submit" style={{ padding:  '10px 20px', background: '#8f1d2c', color: '#fff', border:  'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-end' }}>
          💾 Ruaj
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {isLoading ? <p>⏳ Po ngarkohet...</p> : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={handleAddFavorite}
            />
          ))
        ) : (
          <p>❌ Nuk u gjet asnjë artikull</p>
        )}
      </div>
    </div>
  );
};

export default MenuFilter;