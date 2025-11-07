// Este es el interruptor pa cambiar el tema (oscuro/claro)
export default function ThemeSwitcher() {
  // se llama cuando le damos clic al interruptor
  function handleThemeSwitch(e) {
    const isChecked = e.target.checked // 'true' si esta activao (oscuro)
    document.documentElement.setAttribute('data-bs-theme', isChecked ? 'dark' : 'light')
  }

  return (
    // switch de bootstrap
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
