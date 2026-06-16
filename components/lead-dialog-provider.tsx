
import Lead from "@/types/lead";
import dynamic from "next/dynamic";
import React from "react";
import GetInTouchForm, { getInTouchOptions } from "./get-in-touch-form";

const Dialog = dynamic(() => import("@mui/material/Dialog"), { ssr: false });

interface ContextProps {
  openWhatsApp: (i: string) => Promise<void>;
  openEmail: (i: string) => Promise<void>;
  openPhone: (i: string) => Promise<void>;
}

const Context = React.createContext<ContextProps | null>(null);

export const LeadDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [resolver, setPromiseResolver] = React.useState<
    ((value: Partial<Lead>) => void) | null
  >(null);
  const [intent, setIntent] = React.useState<string>();

  async function openDialog(intent?: string): Promise<Partial<Lead> | null> {
    setIntent(intent);
    return new Promise<Partial<Lead>>((resolve) =>
      setPromiseResolver(() => resolve),
    );
  }

  function resolvePromise(leadData: Partial<Lead>) {
    if (resolver) {
      resolver(leadData);
      setPromiseResolver(null);
    }
  }

  async function openWhatsApp(number: string) {
    const leadData = await openDialog("Clique no botão de WhatsApp do site");
    getInTouchOptions.openWhatsApp(number, leadData?.message || "");
  }

  async function openEmail(address: string) {
    await openDialog("Clique no botão de Email do site");
    window.open(`mailto:${address}`, "_blank");
  }

  async function openPhone(number: string) {
    await openDialog("Clique no botão de Telefone do site");
    getInTouchOptions.openPhone(number);
  }

  return (
    <Context.Provider value={{ openWhatsApp, openEmail, openPhone }}>
      {children}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={resolver !== null}
        onClose={() => setPromiseResolver(null)}
      >
        <GetInTouchForm onSubmit={resolvePromise} />
      </Dialog>
    </Context.Provider>
  );
};

export const useLeadDialog = () => {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error("withLeadDialog must be used within a LeadDialogProvider");
  }

  return context;
};
