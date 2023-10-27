import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

export default function MonthTab(): JSX.Element {
  return (
    <div className="month-tab">
      <div className="month-tab__btn month-tab__btn--prev">
        <FaChevronLeft/>
      </div>

      <div className="month-tab__month">
        October
      </div>

      <div className="month-tab__btn month-tab__btn--next">
        <FaChevronRight/>
      </div>
    </div>
  )
}