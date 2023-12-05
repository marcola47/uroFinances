import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6"

type CardProps = {
  title: string;
  className?: string;
  href?: string;
  children: React.ReactNode;
}

export default function Card({ 
  title, 
  className,
  href,
  children
}: CardProps): JSX.Element {
  return (
    <div className={`card ${className}`}>
      <div className="card__header">
        <h2 className="card__title">
          { title }
        </h2>

        {
          href &&
          <Link 
            href={ href }
            className="card__link"
          > <FaArrowUpRightFromSquare/>
          </Link>
        }
      </div>

      <div className="card__body">
        { children }
      </div>
    </div>
  )
}