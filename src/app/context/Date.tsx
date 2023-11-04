"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";

interface DateContextProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}

const DateContext = createContext<DateContextProps>({
  date: new Date(),
  setDate: () => {},
});

export const DateContextProvider = ({ children }: { children: any }) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <DateContext.Provider value={{ date, setDate }}>
      { children }
    </DateContext.Provider>
  )
}

export const useDateContext = () => useContext(DateContext);