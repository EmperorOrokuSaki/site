export function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21.5 4.5L2.5 12.5L11.5 14.5L14.5 21.5L21.5 4.5Z" />
      <path d="M11.5 14.5L14.5 21.5" />
      <path d="M11.5 14.5L16.5 9.5" />
    </svg>
  )
}
