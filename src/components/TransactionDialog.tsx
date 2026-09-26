import { useEffect, useRef, type ReactNode } from "react";

type TransactionDialogProps = {
  children: ReactNode;
  onCancel: () => void;
};

export default function TransactionDialog({ children, onCancel }: TransactionDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="transaction-dialog"
      aria-labelledby="transaction-form-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      {children}
    </dialog>
  );
}