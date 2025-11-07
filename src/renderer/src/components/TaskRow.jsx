// renderer/src/components/TaskRow.jsx
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ModalDialog from './ModalDialog'

export default function TaskRow({ task }) {
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null)

// renderer/src/components/TaskRow.jsx (Corregido)

  async function handleDelete() {
    try {
      // 1. Llama directamente a la API (esto mostrará el diálogo nativo)
      const confirm = await window.api.deleteItem(task) 

      // 2. Si el usuario pulsó "BORRAR" en el diálogo nativo...
      if (confirm) {
        window.api.getList() // ...refresca la lista
        // 3. (Opcional) Muestra un mensaje de éxito rápido en React
        setDialog({ message: 'Tarea eliminada correctamente', onClose: () => setDialog(null) })
      }
      // Si 'confirm' es falso (el usuario pulsó "Cancelar"), no hace nada.
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al borrar la tarea' })
    }
  }

  return (
    <>
      {' '}
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
          onClose={() => setDialog(null)}
        />
      )}
      {' '}
      <li className="list-group-item d-flex justify-content-between align-items-center gap-2">
        {' '}
        <div>
           <strong>{task.title}</strong> - <em>{task.state}</em> -{' '}
          <small>{task.dueDate}</small>{' '}
        </div>
        {' '}
        <div>
          {' '}
          <button className="btn btn-sm btn-primary" onClick={() => navigate(`/edit/${task.id}`)}>
             Editar {' '}
          </button>
          {' '}
          <button className="btn btn-sm btn-danger" onClick={handleDelete}>
             Borrar {' '}
          </button>
          {' '}
        </div>
        {' '}
      </li>
      {' '}
    </>
  )
}
