import css from './EmptyState.module.css';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return <p className={css.text}>{message}</p>;
}
