import { FaEnvelope } from "react-icons/fa6"

export default function EmailSentPage(): JSX.Element {
  return (
    <div className="email-sent">
      <div className="email-sent__icon">
        <FaEnvelope/>
      </div>

      <h1 className="email-sent__header">
        CONTINUE ON YOUR EMAIL
      </h1>

      <p className="email-sent__text">
        We sent a message to your registered email address with instructions to proceed with your request.
      </p>

      <p className="email-sent__text">
        You can close this page now.
      </p>
    </div>
  )
}