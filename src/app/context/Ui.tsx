"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import ModalConfirmation from "@/app/components/_Modals/ModalConfirmation";
import ModalMultiSelect from "@/app/components/_Modals/ModalMultiSelect";
import ModalWarning from "@/app/components/_Modals/ModalWarning";
import { type } from "os";

type ModalTrans = Partial<TTransaction> & Partial<TRecurrence> & {
  operation: "PUT" | "POST";
}

type ModalWarning = {
  header: string;
  message?: string;
}

type ModalConfirmation = ModalWarning & {
  type: "danger" | "warning" | "success";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

type ModalMultiSelect = Partial<ModalWarning> & {
  options: string[]; //last option is the 'strongest' option
  type: "danger" | "warning" | "success";
  onConfirm: (selected: string) => void;
  onCancel: () => void;
}

interface UIContextProps {
  navbarOpen: boolean;
  setNavbarOpen: Dispatch<SetStateAction<boolean>>;

  modalTrans: ModalTrans | null;
  setModalTrans: Dispatch<SetStateAction<ModalTrans | null>>;

  modalWarning: ModalWarning | null;
  setModalWarning: Dispatch<SetStateAction<ModalWarning | null>>;

  modalMultiSelect: ModalMultiSelect | null;
  setModalMultiSelect: Dispatch<SetStateAction<ModalMultiSelect | null>>;

  modalConfirmation: ModalConfirmation | null;
  setModalConfirmation: Dispatch<SetStateAction<ModalConfirmation | null>>;
}

const UIContext = createContext<UIContextProps>({
  navbarOpen: false,
  setNavbarOpen: () => {},

  modalTrans: null,
  setModalTrans: () => {},

  modalWarning: null,
  setModalWarning: () => {},

  modalMultiSelect: null,
  setModalMultiSelect: () => {},

  modalConfirmation: null,
  setModalConfirmation: () => {}
});

export const UIContextProvider = ({ children }: { children: any }) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [modalTrans, setModalTrans] = useState<ModalTrans | null>(null);
  const [modalWarning, setModalWarning] = useState<ModalWarning | null>(null);
  const [modalMultiSelect, setModalMultiSelect] = useState<ModalMultiSelect | null>(null);
  const [modalConfirmation, setModalConfirmation] = useState<ModalConfirmation | null>(null);

  return (
    <UIContext.Provider value={{ 
      navbarOpen, setNavbarOpen, 
      modalTrans, setModalTrans,
      modalWarning, setModalWarning,
      modalMultiSelect, setModalMultiSelect,
      modalConfirmation, setModalConfirmation
    }}> 
      { children }
      { modalWarning && <ModalWarning/> }
      { modalMultiSelect && <ModalMultiSelect/> }
      { modalConfirmation && <ModalConfirmation/> }
    </UIContext.Provider>
  )
}

export const useUIContext = () => useContext(UIContext);