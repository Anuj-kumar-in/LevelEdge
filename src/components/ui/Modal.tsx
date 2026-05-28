export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-8 shadow-lg relative min-w-[320px]">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}
