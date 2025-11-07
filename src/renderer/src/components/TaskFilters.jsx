// Este componente muestra los filtros para las tareas
export default function TaskFilters({ filterCallback }) {
  // esta funcion se llama cada vez q cambiamos un filtro
  function applyFilters() {
    // pilla los valores de los checkboxes
    const showCompleted = document.getElementById('filter-show-completed').checked
    const showCancelled = document.getElementById('filter-show-cancelled').checked // pilla el valor del select de ordenar
    const sortBy = document.getElementById('sort-by').value //llama a la funcion del padre (TaskList) con los filtros nuevos
    filterCallback({ showCompleted, showCancelled, sortBy })
  }

  return (
    <div className="d-flex gap-2 mb-2 flex-wrap">
      <label>
        <input type="checkbox" id="filter-show-completed" defaultChecked onChange={applyFilters} />
        Mostrar completadas
      </label>
      <label>
        <input type="checkbox" id="filter-show-cancelled" defaultChecked onChange={applyFilters} />
        Mostrar canceladas
      </label>
      {/*el select pa ordenar */}
      <select
        id="sort-by"
        onChange={applyFilters}
        className="form-select ms-auto" // ms-auto lo empuja a la derecha
        style={{ width: 'auto' }}
      >
        <option value="title">Ordenar por Título</option>
        <option value="state">Ordenar por Estado</option>
        <option value="dueDate">Ordenar por Fecha</option>
      </select>
    </div>
  )
}
