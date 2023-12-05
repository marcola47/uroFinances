"use client";
import Navbar from "@/app/components/Navbar/Navbar";
import MonthTab from "@/app/components/MonthTab/MonthTab";
import Balance from "@/app/components/_Home/Balance";

export default function App(): JSX.Element {
  return (
    <div className="app">
      <Navbar/>
      <div className="page home">
        <div className="page__top">
          <MonthTab/>
          <Balance/>
        </div>
      </div>
    </div>
  )
}