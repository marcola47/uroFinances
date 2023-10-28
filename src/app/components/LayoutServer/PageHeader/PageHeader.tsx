export default function PageHeader({ header }: { header: string }): JSX.Element {
  return (
    <h1 className="page-header">
      { header }
    </h1>
  )
}