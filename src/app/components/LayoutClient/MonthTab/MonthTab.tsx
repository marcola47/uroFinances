"use client";
// import { useEffect } from "react";
import { useDateContext } from "@/app/context/Date";
import getMonthName from "@/libs/helpers/getMonthName";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function MonthTab(): JSX.Element {
  const { date, setDate } = useDateContext();
  const curDate = new Date();
  const curYear = date.getFullYear() === curDate.getFullYear();

  return (
    <div className="month-tab">
      <div 
        className="month-tab__btn month-tab__btn--prev"
        onClick={ () => setDate(new Date(date.getFullYear(), date.getMonth() - 1)) }
        children={ <FaChevronLeft/> }
      />
    
      <div className="month-tab__month">
        <span>{ getMonthName(date.getMonth()) } </span>
        <span>{ !curYear && date.getFullYear() }</span>
      </div>

      <div 
        className="month-tab__btn month-tab__btn--next"
        onClick={ () => setDate(new Date(date.getFullYear(), date.getMonth() + 1)) }
        children={ <FaChevronRight/> }
      />
    </div>
  )
}