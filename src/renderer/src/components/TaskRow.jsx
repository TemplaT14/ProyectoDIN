// renderer/src/components/TaskRow.jsx
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ModalDialog from './ModalDialog'

export default function TaskRow({ task }) {
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null)
  // 1. (AÑADIDO) Estado para controlar el desplegable
  const [isOpen, setIsOpen] = useState(false)

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
          // Corrección del bug de navegación que encontramos antes
          onClose={() => {
            if (dialog.onClose) dialog.onClose();
            setDialog(null);
          }}
        />
      )}

      {/* 2. (MODIFICADO) El 'li' ya no es d-flex, solo es el contenedor */}
      <li className="list-group-item">
        {/* Este div interno mantiene la fila principal */}
        <div className="d-flex justify-content-between align-items-center gap-2">
          <div
            style={{ cursor: 'pointer' }}
            // 3. (CAMBIADO) El onClick ahora abre/cierra el desplegable
            onClick={() => setIsOpen(!isOpen)} 
          >
            <strong>{task.title}</strong> - <em>{task.state}</em> - <small>{task.dueDate}</small>
          </div>
          <div>
            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/edit/${task.id}`)}>
              Editar
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
              Borrar
            </button>
          </div>
        </div>

        {/* 4. (AÑADIDO) El bloque desplegable que muestra la descripción */}
        {isOpen && (
          <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}>
            <p className="mb-1"><strong>Descripción:</strong></p>
            {/* Usamos 'pre-wrap' para respetar saltos de línea en la descripción */}
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {task.description || <i>(Sin descripción)</i>}
            </p>
          </div>
        )}
      </li>
    </>
  )
}