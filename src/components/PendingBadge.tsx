export function PendingBadge({ text = 'Dado pendente' }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-400">
      {text}
    </span>
  )
}
