// renderer/src/TaskEdit.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import ModalDialog from './components/ModalDialog'

export default function TaskEdit() {
  const { taskId } = useParams()
  const [task, setTask] = useState({})
  const [originalTask, setOriginalTask] = useState({})
  const [dialog, setDialog] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
  	if (!taskId) return
  	window.api.getItem(taskId).then((itemFetched) => {
  		setTask({ ...itemFetched })
  		setOriginalTask({ ...itemFetched })
  		window.api.setTitle(`Editando: ${itemFetched.title}`) // Esto cambia el título de la VENTANA
  	})
  }, [taskId])

  function handleSave(e) {
  	e.preventDefault()
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
  	if (JSON.stringify(task) !== JSON.stringify(originalTask)) {
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
  			// (AÑADIDO) Pasamos el título de la tarea al formulario
  			formTitle={`Editando: ${task.title || '...'}`}
  		/>
  	</>
  )
}