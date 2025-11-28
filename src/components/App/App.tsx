import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import { fetchNotes, deleteNote } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';

import css from './App.module.css';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => toast.error('Failed to delete note'),
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

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

    
      {isError && <p style={{ color: 'red' }}>❌ Failed to load notes</p>}

      {isLoading && <p>Loading...</p>}
      {!isLoading && notes.length > 0 && (
        <NoteList notes={notes} onDelete={(id: string) => deleteMutation.mutate(id)} />
      )}

      {!isLoading && !notes.length && <p>No notes found</p>}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm
            onSuccess={() => {
              setIsOpen(false);
              setPage(1);
              queryClient.invalidateQueries({ queryKey: ['notes'] });
            }}
          />
        </Modal>
      )}
    </div>
  );
}
