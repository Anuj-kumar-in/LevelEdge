export default function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="rounded-pill px-5 py-2 bg-accent text-white font-bold uppercase tracking-wider transition hover:bg-accent-hover" {...props}>
      {children}
    </button>
  );
}
