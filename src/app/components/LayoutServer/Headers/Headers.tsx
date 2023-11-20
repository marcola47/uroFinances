export function HeaderPage({ header }: { header: string }): JSX.Element {
  return (
    <h1 className="header--page">
      { header }
    </h1>
  )
}

// LineThroughHeader
export function HeaderLineTh({ header }: { header: string }): JSX.Element {
  return (
    <h3 className="header--line-th">
      { header }
    </h3>
  )
}