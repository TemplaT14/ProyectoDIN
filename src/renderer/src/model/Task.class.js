// esta es la 'plantilla' para crear tareas
export default class Task {
  constructor(title, description = '', state = 'Pendiente', dueDate = null) {
    // el id unico. Usamos el timestamp
    // no es perfecto pero vale
    this.id = Date.now()
    this.title = title
    this.description = description
    this.state = state // por defecto 'Pendiente'

    // si no nos pasan fecha (dueDate es null)...
    // ...calcula 7 dias desde hoy y lo pone en formato 'YYYY-MM-DD'
    this.dueDate =
      dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
}