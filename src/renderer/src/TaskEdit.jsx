// renderer/src/TaskEdit.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import ModalDialog from './components/ModalDialog'

export default function TaskEdit() {
  const { taskId } = useParams()
  const [task, setTask] = useState({})
  const [originalTask, setOriginalTask] = useState({}) // Ya teníamos esto
  const [dialog, setDialog] = useState(null)
  const navigate = useNavigate()

  // 1. (AÑADIDO) Calculamos si hay cambios
  // Comparamos los strings de la tarea original y la actual
  const hasChanges = JSON.stringify(task) !== JSON.stringify(originalTask)

  useEffect(() => {
  	if (!taskId) return
  	window.api.getItem(taskId).then((itemFetched) => {
  		setTask({ ...itemFetched })
  		setOriginalTask({ ...itemFetched }) // Guardamos la copia original
  		window.api.setTitle(`Editando: ${itemFetched.title}`)
  	})
  }, [taskId])

  function handleSave(e) {
  	e.preventDefault()
    // (MODIFICADO) Añadimos comprobación por si acaso
  	if (!hasChanges) return 

  	if (!task.title.trim()) {
  		setDialog({ message: 'El título no puede estar vacío' })
  		return
  	}
  	try {
  		window.api.updateItem(task)
  		window.api.getList()
  		setDialog({ message: 'Tarea actualizada correctamente', onClose: () => navigate('/') })
  	} catch (err) {
  		console.error(err)
  		setDialog({ message: 'Error al actualizar la tarea' })
  	}
  }

  function handleDelete() {
  	setDialog({
  		message: '¿Deseas borrar esta tarea?',
  		onConfirm: async () => {
  			try {
  				const confirm = await window.api.deleteItem(task)
  				if (confirm) {
  					setDialog({ message: 'Tarea borrada correctamente', onClose: () => navigate('/') })
  				}
  			} catch (err) {
  				console.error(err)
  				setDialog({ message: 'Error al borrar la tarea' })
  			}
  		}
  	})
  }

  async function handleBack() {
    // (MODIFICADO) Usamos la variable 'hasChanges' que ya calculamos
  	if (hasChanges) {
  		const result = await window.api.confirmItem(task)
  		if (result === 'discard' || result === 'save') navigate('/')
  	} else {
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
  			if (dialog.onClose) dialog.onClose();
  			setDialog(null);
  			}}
  		/>
  		)}
  		<TaskForm
  			task={task}
  			setTask={setTask}
  			onSubmit={handleSave}
  			onDiscard={handleBack}
  			formTitle={`Editando: ${task.title || '...'}`}
            // 2. (AÑADIDO) Pasamos las nuevas props
  			discardButtonText="Volver"
  			isSaveDisabled={!hasChanges} 
  		/>
  	</>
  )
}