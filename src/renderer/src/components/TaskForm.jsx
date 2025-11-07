// Este es el formulario q se re-usa en 'Crear' y 'Editar'
// solo recibe props y no hace nada mas
export default function TaskForm({
  task, // el objeto de la tarea
  setTask, // la funcion pa cambiar la tarea (useState)
  onSubmit, // la funcion pa guardar (handleSave)
  onDiscard, // la funcion pa descartar (handleBack)
  onDelete, // la funcion pa borrar (handleDelete)
  formTitle, // el titulo "Editando: Tarea 1"
  isSaveDisabled, // desactivar el boton de guardar
  discardButtonText // Para q ponga "Volver" en vez de "Descartar"
}) {
  return (
    <form onSubmit={onSubmit}>
      {/*usa el formTitle, y si no hay, pone 'Nueva tarea' */}
      <h2 className="mb-3">{formTitle || 'Nueva tarea'}</h2>  {/* Campo Título */}
      <div className="mb-3">
        <label htmlFor="taskTitle" className="form-label">
           Titulo 
        </label>
        <input
          type="text"
          className="form-control"
          id="taskTitle"
          required // obligatorio
          placeholder="Título de la tarea"
          value={task.title ?? ''} // '??' no da error si es null
          // actualizar el estado al escribir
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
      </div>
       {/* Campo Descripción */}
      <div className="mb-3">
        <label htmlFor="taskDescription" className="form-label">
           Descripción 
        </label>
        <textarea
          className="form-control"
          id="taskDescription"
          rows="3"
          placeholder="Descripción (opcional)"
          value={task.description ?? ''}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
      </div>
       {/* Campo Estado */}
      <div className="mb-3">
        <label htmlFor="taskState" className="form-label">
           Estado 
        </label>
        <select
          className="form-select"
          id="taskState"
          value={task.state ?? 'Pendiente'} // por defecto 'Pendiente'
          onChange={(e) => setTask({ ...task, state: e.target.value })}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Completada">Completada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>
       {/* Campo Fecha Límite */}
      <div className="mb-3">
        <label htmlFor="taskDueDate" className="form-label">
           Fecha Límite 
        </label>
        <input
          type="date"
          className="form-control"
          id="taskDueDate"
          value={task.dueDate ?? ''}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        />
      </div>
       {/* Botones de Acción */}
      <div className="d-flex gap-2 mt-4">
         {/* el boton de guardar esta 'disabled' si 'isSaveDisabled' es true */}
        <button type="submit" className="btn btn-primary" disabled={isSaveDisabled}>
           Guardar
        </button>
         {/* el boton de descartar/volver solo se ve si existe la funcion 'onDiscard' */}
        {onDiscard && (
          <button type="button" className="btn btn-secondary" onClick={onDiscard}>
             {/* usa el texto q le pasamos (Volver) o 'Descartar' */}
            {discardButtonText || 'Descartar'}
          </button>
        )}
        {/* el boton de borrar solo se ve si existe 'onDelete' (en modo Editar) */}
        {onDelete && (
          <button type="button" className="btn btn-danger" onClick={onDelete}>
             Borrar 
          </button>
        )}
      </div>
    </form>
  )
}
