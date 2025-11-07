// renderer/src/components/TaskFilters.jsx
export default function TaskFilters({ filterCallback }) {
  function applyFilters() {
    const showCompleted = document.getElementById('filter-show-completed').checked
    const showCancelled = document.getElementById('filter-show-cancelled').checked
    const sortBy = document.getElementById('sort-by').value 
    
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

      <select id="sort-by" onChange={applyFilters} className="form-select ms-auto" style={{ width: 'auto' }}>
        <option value="title">Ordenar por Título</option>
        <option value="state">Ordenar por Estado</option>
        <option value="dueDate">Ordenar por Fecha</option>
      </select>
    </div>
  )
}