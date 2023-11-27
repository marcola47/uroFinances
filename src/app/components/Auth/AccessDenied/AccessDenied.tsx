import { useRouter } from "next/navigation";

export default function AccessDenied(): JSX.Element {
  const router = useRouter();
  
  return (
    <div className="access-denied">
      <h1 className="access-denied__header">
        NO PERMISSION TO ACCESS THIS PAGE
      </h1>

      <button
        className="btn btn--bg-blue"
        onClick={ () => router.push('/') }
      > GO TO HOME PAGE
      </button>
    </div>
  )
}