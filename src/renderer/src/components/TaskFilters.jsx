// renderer/src/components/TaskFilters.jsx (Modificado)
export default function TaskFilters({ filterCallback }) {
  
  function applyFilters() {
    // Hemos quitado las 'const title' y 'const state'
    const showCompleted = document.getElementById('filter-show-completed').checked
    const showCancelled = document.getElementById('filter-show-cancelled').checked
    const sortBy = document.getElementById('sort-by').value 
    
    // Pasamos solo los filtros que quedan
    filterCallback({ showCompleted, showCancelled, sortBy })
  }

  return (
    // 'flex-wrap' sigue siendo útil por si acaso
    <div className="d-flex gap-2 mb-2 flex-wrap"> 

      {/* Input de 'filter-title' ELIMINADO */}
      {/* Select de 'filter-state' ELIMINADO */}

      <label>
        <input type="checkbox" id="filter-show-completed" defaultChecked onChange={applyFilters} />
        Mostrar completadas
      </label>
      <label>
        <input type="checkbox" id="filter-show-cancelled" defaultChecked onChange={applyFilters} />
        Mostrar canceladas
      </label>

      {/* 'ms-auto' empuja el selector de orden a la derecha */}
      <select id="sort-by" onChange={applyFilters} className="form-select ms-auto" style={{ width: 'auto' }}>
        <option value="id">Ordenar por (Defecto)</option>
        <option value="title">Ordenar por Título</option>
        <option value="state">Ordenar por Estado</option>
        <option value="dueDate">Ordenar por Fecha</option>
      </select>
    </div>
  )
}