export default function ThemeSwitcher() {
  function handleThemeSwitch(e) {
    const isChecked = e.target.checked
    document.documentElement.setAttribute('data-bs-theme', isChecked ? 'dark' : 'light')
  }

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        onClick={handleThemeSwitch}
      />
    </div>
  )
}
