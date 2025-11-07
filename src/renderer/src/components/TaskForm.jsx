// renderer/src/components/TaskForm.jsx
export default function TaskForm({
  task,
  setTask,
  onSubmit,
  onDiscard,
  onDelete,
  formTitle,
  isSaveDisabled, // 1. (AÑADIDO) Prop para deshabilitar el botón
  discardButtonText // 2. (AÑADIDO) Prop para el texto del botón
}) {
  return (
  	<form onSubmit={onSubmit}>
  		<h2 className="mb-3">{formTitle || 'Nueva tarea'}</h2>

  		{/* Campo Título */}
  		<div className="mb-3">
  			<label htmlFor="taskTitle" className="form-label">
  			Titulo
  			</label>
  			<input
  			type="text"
  			className="form-control"
  			id="taskTitle"
  			required
  			placeholder="Título de la tarea"
  			value={task.title ?? ''}
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
  			value={task.state ?? 'Pendiente'}
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
            {/* 3. (MODIFICADO) Se añade 'disabled' */}
  			<button type="submit" className="btn btn-primary" disabled={isSaveDisabled}>
  			Guardar
  			</button>
  			
  			{onDiscard && (
  			<button type="button" className="btn btn-secondary" onClick={onDiscard}>
                {/* 4. (MODIFICADO) Se usa el texto de la prop */}
  				{discardButtonText || 'Descartar'} 
  			</button>
  			)}
  			
  			{onDelete && (
  			<button type="button" className="btn btn-danger" onClick={onDelete}>
  				Borrar
  			</button>
  			)}
  		</div>
  	</form>
  )
}