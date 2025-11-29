import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';

import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
 }

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Мутація для видалення нотатки
  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Note deleted');
      // Інвалідація кешу після успішного видалення
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });

const handleDelete = (id: string) => {
  mutate(id);
};

  if (notes.length === 0) return <p>No notes found</p>;

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={isPending}
            >Delete
              {/* {isPending ? 'Deleting...' : 'Delete'} */}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
