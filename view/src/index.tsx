import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './pages/home'
import { League } from './pages/league'

const container = document.getElementById('app')
const root = createRoot(container!)

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:leagueId/:userId" element={<League />} />
    </Routes>
  </BrowserRouter>
);