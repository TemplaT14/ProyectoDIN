export default function TaskFilters({ filterCallback }) {
  
  function applyFilters() {
    const title = document.getElementById('filter-title').value
    const state = document.getElementById('filter-state').value
    const showCompleted = document.getElementById('filter-show-completed').checked
    const showCancelled = document.getElementById('filter-show-cancelled').checked
    filterCallback({ title, state, showCompleted, showCancelled })
  }

  return (
    <div className="d-flex gap-2 mb-2">
      <input id="filter-title" placeholder="Buscar por título..." onChange={applyFilters} />
      <select id="filter-state" onChange={applyFilters}>
        <option value="">Todos los estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En proceso">En proceso</option>
        <option value="Completada">Completada</option>
        <option value="Cancelada">Cancelada</option>
      </select>
      <label>
        <input type="checkbox" id="filter-show-completed" defaultChecked onChange={applyFilters} />
        Mostrar completadas
      </label>
      <label>
        <input type="checkbox" id="filter-show-cancelled" defaultChecked onChange={applyFilters} />
        Mostrar canceladas
      </label>
    </div>
  )
}
