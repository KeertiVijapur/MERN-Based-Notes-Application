import React, { useState, useEffect } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user info from localStorage
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const onLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    navigate('/login');
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Add actual search logic here
  };

  const onClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2
        className="text-xl font-medium text-black py-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        Notes
      </h2>

      <div className="flex items-center gap-4">
        {SearchBar ? (
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        ) : (
          <p className="text-red-500 text-xs">SearchBar component missing!</p>
        )}

        {userInfo ? (
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        ) : (
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
