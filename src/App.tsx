import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewsGrid from '@components/newsGrid/index'
import LogIn from '@components/logIn/index'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewsGrid />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="*" element={<div>404 – Страница не найдена</div>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
