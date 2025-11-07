// renderer/src/components/TaskRow.jsx
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ModalDialog from './ModalDialog'

export default function TaskRow({ task }) {
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null)
  const [isOpen, setIsOpen] = useState(false) // (SE MANTIENE) Para el desplegable de descripción

  async function handleDelete() {
    try {
      const confirm = await window.api.deleteItem(task) 
      if (confirm) {
        window.api.getList() 
        setDialog({ message: 'Tarea eliminada correctamente', onClose: () => setDialog(null) })
      }
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al borrar la tarea' })
    }
  }

  // 1. (AÑADIDO) Nueva función para manejar el <select>
  async function handleStateChange(e) {
    const newState = e.target.value;
    try {
      await window.api.updateItem({ ...task, state: newState });
      window.api.getList(); // Dispara la recarga de la lista
      setDialog({ message: `Estado cambiado a ${newState}` });
    } catch (err) {
      console.error(err);
      setDialog({ message: 'Error al cambiar el estado' });
    }
  }


  return (
    <>
      {dialog && (
        <ModalDialog
          message={dialog.message}
          onConfirm={
            dialog.onConfirm
              ? () => {
                  dialog.onConfirm()
                  setDialog(null)
                }
              : null
          }
          onClose={() => {
            if (dialog.onClose) dialog.onClose();
            setDialog(null);
          }}
        />
      )}

      <li className="list-group-item">
        <div className="d-flex justify-content-between align-items-center gap-2">
          
          {/* 2. (MODIFICADO) Lado izquierdo (Título, Select de Estado, Fecha) */}
          <div
            // Usamos flex-grow-1 para que ocupe el espacio
            className="d-flex align-items-center gap-2 flex-grow-1"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsOpen(!isOpen)} 
          >
            <strong>{task.title}</strong>

            {/* 3. (AÑADIDO) El <select> para cambiar estado */}
            <select
              className="form-select form-select-sm"
              style={{ width: '150px' }} // Ancho fijo para el select
              value={task.state}
              onChange={handleStateChange}
              // Previene que el clic abra el desplegable de descripción
              onClick={(e) => e.stopPropagation()} 
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>

            {/* Usamos ms-auto para empujar la fecha a la derecha de este div */}
            <small className="ms-auto">{task.dueDate}</small> 
          </div>

          {/* Lado derecho (Botones) - Sin cambios */}
          <div>
            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/edit/${task.id}`)}>
              Editar
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
              Borrar
            </button>
          </div>
        </div>

        {/* 4. (SE MANTIENE) El bloque desplegable de descripción */}
        {isOpen && (
          <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}>
            <p className="mb-1"><strong>Descripción:</strong></p>
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {task.description || <i>(Sin descripción)</i>}
            </p>
          </div>
        )}
      </li>
    </>
  )
}