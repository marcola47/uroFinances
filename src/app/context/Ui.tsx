"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import ModalConfirmation from "@/app/components/Modals/ModalConfirmation";

type ModalTrans = Partial<TTransaction> & Partial<TRecurrence> & {
  operation: "PUT" | "POST";
}

type ModalConfirmation = {
  header: string;
  message: string;
  type: "danger" | "warning" | "success";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface UIContextProps {
  navbarOpen: boolean;
  setNavbarOpen: Dispatch<SetStateAction<boolean>>;

  modalTrans: ModalTrans | null;
  setModalTrans: Dispatch<SetStateAction<ModalTrans | null>>;

  modalConfirmation: ModalConfirmation | null;
  setmodalConfirmation: Dispatch<SetStateAction<ModalConfirmation | null>>;
}

const UIContext = createContext<UIContextProps>({
  navbarOpen: false,
  setNavbarOpen: () => {},

  modalTrans: null,
  setModalTrans: () => {},

  modalConfirmation: null,
  setmodalConfirmation: () => {}
});

export const UIContextProvider = ({ children }: { children: any }) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [modalTrans, setModalTrans] = useState<ModalTrans | null>(null);
  const [modalConfirmation, setmodalConfirmation] = useState<ModalConfirmation | null>({
    header: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
    onCancel: () => {}
  
  });

  return (
    <UIContext.Provider value={{ 
      navbarOpen, setNavbarOpen, 
      modalTrans, setModalTrans,
      modalConfirmation, setmodalConfirmation
    }}> 
      {
        modalConfirmation &&
        <ModalConfirmation/>
      }

      { children }
    </UIContext.Provider>
  )
}

export const useUIContext = () => useContext(UIContext);