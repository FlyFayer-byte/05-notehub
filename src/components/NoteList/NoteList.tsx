import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { fetchNotes, deleteNote } from '../../services/noteService';

import type { Note } from '../../types/note';
import type { FetchNotesResponse } from '../../services/noteService';

import toast from 'react-hot-toast';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import css from './NoteList.module.css';

interface NoteListProps {
  search: string;
  page: number;
  onTotalPagesChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function NoteList({
  search,
  page,
  onTotalPagesChange,
}: NoteListProps) {
  const queryClient = useQueryClient();

  // Отримання списку нотаток з бекенду
  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    placeholderData: prev => prev,
  });

  // Видалення нотатки
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => toast.error('Failed to delete note'),
  });

  const handleDelete = (id: string) => mutation.mutate(id);

  // Оновлення totalPages у батьківському компоненті
  useEffect(() => {
    if (!data) return;

    onTotalPagesChange(prev =>
      prev !== data.totalPages ? data.totalPages : prev
    );
  }, [data, onTotalPagesChange]);

  // UI стани
  if (isLoading && !data) return <Loader />;
  if (isError) return <ErrorMessage message="❌ Failed to load notes" />;
  if (!data || data.notes.length === 0)
    return <p>No notes found for "{search}"</p>;

  return (
    <ul className={css.list}>
      {data.notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
