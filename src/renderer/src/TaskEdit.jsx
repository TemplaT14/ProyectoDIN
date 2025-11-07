import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm' // el formulario 
import ModalDialog from './components/ModalDialog' // el modal de react

// pagina de edit
export default function TaskEdit() {
  const { taskId } = useParams() //  tarea q estamos editando
  const [task, setTask] = useState({}) // guardamos una copia de la tarea original la usamos pa saber si hay cambios o no
  const [originalTask, setOriginalTask] = useState({})
  const [dialog, setDialog] = useState(null) // modales de react
  const navigate = useNavigate() //volver a la lista
  // esto calcula si hay cambios (pa activar/desactivar 'Guardar') compara la tarea original (string) con la tarea actual (string)
  const hasChanges = JSON.stringify(task) !== JSON.stringify(originalTask) // esto se ejecuta cuando el componente carga (o si cambia el taskId)

  useEffect(() => {
    if (!taskId) return // si no hay id, no hace nada
    // llama al 'main' y coje los datos de esta tarea
    window.api.getItem(taskId).then((itemFetched) => {
      setTask({ ...itemFetched }) // rellena el formulario
      setOriginalTask({ ...itemFetched }) // guarda la copia original
      window.api.setTitle(`Editando: ${itemFetched.title}`)
    })
  }, [taskId]) // el [taskId] hace q se ejecute si el id cambia

  // se llama al pulsar 'Guardar'
  function handleSave(e) {
    e.preventDefault() // si no hay cambios, no hace nada (el boton deberia estar disabled, pero por si acaso)
    if (!hasChanges) return // validacion de titulo vacio

    if (!task.title.trim()) {
      setDialog({ message: 'El título no puede estar vacío' })
      return
    }
    try {
      window.api.updateItem(task) //actualizar
      window.api.getList() // refresca la lista
      // saca el modal de 'guardado ok' y le dice q navege al cerrar
      setDialog({ message: 'Tarea actualizada correctamente', onClose: () => navigate('/') })
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al actualizar la tarea' })
    }
  }
  async function handleDelete() {
    try {
      // llama al 'main' (store:delete-item) q saca el 'alert' nativo
      const confirm = await window.api.deleteItem(task) // si el usuario le dio a 'BORRAR' en el alert
      if (confirm) {
        // saca el modal de 'borrado ok' y navega al cerrar
        setDialog({ message: 'Tarea borrada correctamente', onClose: () => navigate('/') })
      }
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al borrar la tarea' })
    }
  } //llama al pulsar 'Volver'
  async function handleBack() {
    if (hasChanges) { // usa la variable 'hasChanges' pa saber si hay q preguntar
      const result = await window.api.confirmItem(task) // si le da a 'descartar' o 'guardar', volvemos a la lista
      if (result === 'discard' || result === 'save') navigate('/')
    } else {
      // si no hay cambios, vuelve a la lista sin preguntar
      navigate('/')
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
            if (dialog.onClose) dialog.onClose()
            setDialog(null)
          }}
        />
      )}
      <TaskForm
        task={task}
        setTask={setTask}
        onSubmit={handleSave}
        onDiscard={handleBack} // la funcion de 'Volver'
        formTitle={`Editando: ${task.title || '...'}`} 
        discardButtonText="Volver" //deshabilita 'Guardar' si no hay cambios
        isSaveDisabled={!hasChanges}
        onDelete={handleDelete}
      />
    </>
  )
}
