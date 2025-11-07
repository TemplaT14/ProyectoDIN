import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Task from './model/Task.class'
import TaskForm from './components/TaskForm'
import ModalDialog from './components/ModalDialog'

export default function TaskCreate() {
  const navigate = useNavigate()

  const [task, setTask] = useState(
    new Task(
      '', // título
      '', // descripción
      'Pendiente', // estado
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // fecha
    )
  )

  const [dialog, setDialog] = useState(null) // { message, onConfirm?, onClose? }

  async function handleSave(e) {
    e.preventDefault()
    if (!task.title.trim()) {
      setDialog({ message: 'El título no puede estar vacío' })
      return
    }
    try {
      window.api.addItem(task)
      window.api.getList()
      setDialog({ message: 'Tarea creada correctamente', onClose: () => navigate('/') })
    } catch (err) {
      console.error(err)
      setDialog({ message: 'Error al crear la tarea' })
    }
  }

  async function handleDiscard() {
    const result = await window.api.confirmItem(task)
    if (result === 'discard') navigate('/')
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
          onClose={() => setDialog(null)}
        />
      )}
      <TaskForm 
      task={task} 
      setTask={setTask} 
      onSubmit={handleSave} 
      onDiscard={handleDiscard} 
      />
    </>
  )
}
