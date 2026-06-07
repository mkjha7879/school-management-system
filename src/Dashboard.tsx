type DashboardProps = {
  email: string
  onLogout: () => void
}

export default function Dashboard({ email, onLogout }: DashboardProps) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Signed in as <strong>{email}</strong>
          </p>
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          Log out
        </button>
      </header>

      <section className="dashboard-content">
        <p>You are successfully logged in.</p>
      </section>
    </div>
  )
}
