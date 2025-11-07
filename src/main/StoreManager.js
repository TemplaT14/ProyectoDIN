import Store from 'electron-store'

// Esta clase usa electron-store para guardar los datos
export class StoreManager extends Store {
  constructor(options) {
    super(options)
    // Carga la lista q tengamos guardada al iniciar, si no hay nada crea un array vacio.
    this.list = this.get('task-list') || []
  }

  // funcion para guardar la lista actual en el disco
  saveList() {
    this.set('task-list', this.list)
    return this.list
  }

  // funcion para traer la lista del disco
  getList() {
    this.list = this.get('task-list') || []
    return this.list
  }

  // buscar una tarea por su ID
  getItem(taskId) {
    this.getList()
    return this.list.find((t) => t.id == taskId)
  }

  // añadir una tarea nueva
  addItem(task) {
    // [...this.list] crea una copia y añade la tarea nueva
    this.list = [...this.list, task]
    return this.saveList() // guarda en disco
  }

  // borrar una tarea
  deleteItem(task) {
    // .filter crea una lista nueva solo con las tareas
    this.list = this.list.filter((t) => t.id !== task.id)
    return this.saveList() // guarda
  }

  // actualizar una tarea
  updateItem(task) {
    this.list = this.list.map((t) => (t.id === task.id ? task : t))// si el id coincide, pone la tarea nueva (actualizada)si no, deja la tarea vieja (t)
    return this.saveList() // guarda
  }
}