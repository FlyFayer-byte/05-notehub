import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App/App';
import './index.css';

// Імпортуємо QueryClient та Provider для роботи React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Опціонально — Devtools для відладки запитів
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Створюємо єдиний клієнт React Query
// Цей обʼєкт керує кешем, політикою повторних запитів і т.д.
const queryClient = new QueryClient();

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Робимо React Query доступним для всього застосунку */}
    <QueryClientProvider client={queryClient}>
    <App />

    {/* Devtools — інструмент для відладки запитів */}
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
