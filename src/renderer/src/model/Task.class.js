export default class Task {
  constructor(title, description = '', state = 'Pendiente', dueDate = null) {
    this.id = Date.now() // ID único basado en timestamp
    this.title = title
    this.description = description
    this.state = state // "Pendiente", "En proceso", "Completada", "Cancelada"
    this.dueDate =
      dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 días por defecto
  }
}
