// renderer/src/components/TaskRow.jsx
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ModalDialog from './ModalDialog'

export default function TaskRow({ task }) {
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null)
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

  async function handleStateChange(e) {
    const newState = e.target.value;
    try {
      await window.api.updateItem({ ...task, state: newState });
      window.api.getList(); 
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
          <div
            className="d-flex align-items-center gap-2 flex-grow-1"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsOpen(!isOpen)} 
          >
            <i className={`bi ${isOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>

            <strong>{task.title}</strong>

            <select
              className="form-select form-select-sm"
              style={{ width: '150px' }} 
              value={task.state}
              onChange={handleStateChange}
              onClick={(e) => e.stopPropagation()} 
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>

            <small className="ms-auto">{task.dueDate}</small> 
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