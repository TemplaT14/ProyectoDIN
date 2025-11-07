import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ModalDialog from './ModalDialog'

// Este componente es cada fila de la lista de tareas
export default function TaskRow({ task }) {
  const navigate = useNavigate() // navegar a 'Editar'
  const [dialog, setDialog] = useState(null) 
  const [isOpen, setIsOpen] = useState(false) // controlar el desplegable de la descripcion

  //Funcion borrar  tarea
  async function handleDelete() {
    try {
      // Llama al 'main' (store:delete-item) q saca el 'alert' 
      const confirm = await window.api.deleteItem(task) // si el usuario le dio a 'BORRAR' en el alert
      if (confirm) {
        window.api.getList() // refresca la lista
        setDialog({ message: 'Tarea eliminada correctamente', onClose: () => setDialog(null) })
      }
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al borrar la tarea' })
    }
  } 
  // Esto se llama cuando cambiamos el <select> del estado
  async function handleStateChange(e) {
    const newState = e.target.value // valor nuevo ej. "Completada"
    try {
      // Llama al main pa actualizar
      await window.api.updateItem({ ...task, state: newState })
      window.api.getList() // refresca la lista
      setDialog({ message: `Estado cambiado a ${newState}` })
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al cambiar el estado' })
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
          } //Esto hace retornar a la pantalla anterior cuando le damos a confirmar
          onClose={() => {
            if (dialog.onClose) dialog.onClose()
            setDialog(null)
          }}
        />
      )}
      <li className="list-group-item">
          {/* Esta es la fila principal (la q se ve siempre) */}
        <div className="d-flex justify-content-between align-items-center gap-2">
            {/* div clicable para abrir el desplegable */}
          <div
            className="d-flex align-items-center gap-2 flex-grow-1"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsOpen(!isOpen)} // abre y cierra el desplegable
          >
             {/*  flechita */}
            <i className={`bi ${isOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i> 
            <strong>{task.title}</strong> 
            {/* el <select> pa cambiar el estado */}
            <select
              className="form-select form-select-sm"
              style={{ width: '150px' }}
              value={task.state}
              onChange={handleStateChange} // esto es importante para q al clicar el select NO se abra el desplegable
              onClick={(e) => e.stopPropagation()}
            >
               <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Completada">Completada</option>* 
              <option value="Cancelada">Cancelada</option>
            </select>
              {/* la fecha, 'ms-auto' la empuja a la derecha de este bloque */}
            <small className="ms-auto">{task.dueDate}</small>
          </div>
            {/* los botones de la derecha */}
          <div>
             {/* Boton Editar (navega a la otra pagina) */}
            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/edit/${task.id}`)}>
               Editar 
            </button>
              {/* Boton Borrar (llama a la funcion de arriba) */}
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
               Borrar 
            </button>
          </div>
        </div>
          {/* El desplegable con la descripcion solo se muestra si 'isOpen' es 'true' */}
        {isOpen && (
          <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}>
            * 
            <p className="mb-1">
               <strong>Descripción:</strong>
            </p>
             {/* 'pre-wrap' respeta los saltos de linea q escribamos */}
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
               {task.description || <i>(Sin descripción)</i>}
            </p>
          </div>
        )}
      </li>
    </>
  )
}
