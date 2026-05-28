export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="border border-border rounded-md px-3 py-2 focus:outline-accent w-full" {...props} />;
}
