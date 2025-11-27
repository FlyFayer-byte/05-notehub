import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css';

export default function App() {
  // Стан модалки
  const [isOpen, setIsOpen] = useState(false);

  // Стан пошукового запиту
  const [searchQuery, setSearchQuery] = useState('');

  // Стан пагінації
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Скільки нотаток отримано (для контролю рендера NoteList)
  const [, setNoteCount] = useState(0);

  // Затримка вводу перед запитом
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchQuery}
          onSearchChange={value => {
            setSearchQuery(value);
            setPage(1);
          }}
        />

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {/* Показуємо NoteList лише якщо є нотатки */}
        <NoteList
          search={debouncedSearch}
          page={page}
          onTotalPagesChange={setTotalPages}
          onCountChange={setNoteCount}
        />
      

      {/* Показуємо Pagination лише якщо сторінок більше однієї */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Модалка */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm
            onSuccess={() => {
              setIsOpen(false);
              setPage(1);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
