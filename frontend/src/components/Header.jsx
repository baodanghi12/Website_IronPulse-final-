import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleBuyNow = () => {
    navigate('/category/sale');
  };

  return (
    <div style={styles.headerContainer}>
      <div style={styles.headerContent}>
        <h1 style={styles.title}>{t('saleTitle')}</h1>
        <button style={styles.button} onClick={handleBuyNow}>
          {t('buyNow')}
        </button>
      </div>
      <div style={styles.languageSelector}>
        <select
          value={i18n.language}
          onChange={handleLanguageChange}
          style={styles.select}
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

const styles = {
  headerContainer: {
    width: '100%',
    backgroundColor: 'black',
    color: 'white',
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: '20px',
    margin: '0',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    marginLeft: '20px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  languageSelector: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  select: {
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
  },
};

export default Header; // 👈 Quan trọng!
