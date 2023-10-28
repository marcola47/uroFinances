import Navbar from "@/app/components/LayoutClient/Navbar/Navbar";

export default function ChangePasswordPage(): JSX.Element {
  return (
    <div className="app">
      <Navbar/>

      <div className="change-pwd">
        <h1 className="change-pwd__header">
          CHANGE YOUR PASSWORD
        </h1>
        <p className="change-pwd__text">
          You can send an email to your registered email account to reset your password
        </p>
      </div>
    </div>
  )
}