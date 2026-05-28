export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="border border-border rounded-md px-3 py-2 focus:outline-accent w-full" {...props} />;
}
