// renderer/src/components/TaskRow.jsx
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ModalDialog from './ModalDialog'

export default function TaskRow({ task }) {
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null)

  function handleDelete() {
    setDialog({
      message: '¿Deseas borrar esta tarea?',
      onConfirm: async () => {
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
    })
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
