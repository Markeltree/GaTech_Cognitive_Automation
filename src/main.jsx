import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles.css';

import CaseStudy from './pages/CaseStudy';
import ConsoleLayout from './components/ConsoleLayout';
import { Backdrop } from './components/ui';

// Console modules are code-split; the landing page stays light.
const Overview = lazy(() => import('./pages/Overview'));
const Documents = lazy(() => import('./pages/Documents'));
const Decisions = lazy(() => import('./pages/Decisions'));
const Language = lazy(() => import('./pages/Language'));
const Forecasts = lazy(() => import('./pages/Forecasts'));
const Workflows = lazy(() => import('./pages/Workflows'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Backdrop />
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<CaseStudy />} />
          <Route path="/console" element={<ConsoleLayout />}>
            <Route index element={<Overview />} />
            <Route path="documents" element={<Documents />} />
            <Route path="decisions" element={<Decisions />} />
            <Route path="language" element={<Language />} />
            <Route path="forecasts" element={<Forecasts />} />
            <Route path="workflows" element={<Workflows />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
