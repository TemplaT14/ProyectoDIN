import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react' // Importar useEffect
import Task from './model/Task.class' // la plantilla de tarea
import TaskForm from './components/TaskForm' // el formulario tonto
import ModalDialog from './components/ModalDialog' // el modal de react
// Esta es la 'pagina' de /new
export default function TaskCreate() {
  const navigate = useNavigate() // pa navegar (volver a la lista)
  // Este es el estado de la tarea q estamos creando
  const [task, setTask] = useState(
    new Task(
      '', // título
      '', // descripción
      'Pendiente', // estado
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // fecha
    )
  ) 
  // dialogos de react (ej. "guardado ok")
  const [dialog, setDialog] = useState(null) // esto cambia el titulo de la ventana
  useEffect(() => {
    window.api.setTitle('Nueva Tarea')
    }, []) 
  async function handleSave(e) {
    e.preventDefault() // pa q el formulario no recargue la pagina
    // una validacion simple
    if (!task.title.trim()) {
      setDialog({ message: 'El título no puede estar vacío' })
      return
    }
    try {
      window.api.addItem(task) // llama al main guardar
      window.api.getList() // refresca la lista 
      // le dice q cuando se cierre (onClose), navegue a la lista (/)
      setDialog({ message: 'Tarea creada correctamente', onClose: () => navigate('/') })
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al crear la tarea' })
    }
  } // al pulsar 'Descartar'llama al dialogo nativo de confirmar (el del main)
  async function handleDiscard() {
    // 
    const result = await window.api.confirmItem(task)
    if (result === 'discard') navigate('/') // si le damos a descartar, volvemos
  }
  return (
    <>
      {/* guardado ok */}
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
            if (dialog.onClose) dialog.onClose() // aqui es donde navega
            setDialog(null) // cierra el modal
          }}
        />
      )}
      {/* Renderiza el formulario 'tonto' y le pasa todo lo q necesita */}
     <TaskForm task={task} setTask={setTask} onSubmit={handleSave} onDiscard={handleDiscard} />
    </>
  )
}
