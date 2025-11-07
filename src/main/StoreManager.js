import Store from 'electron-store'

export class StoreManager extends Store {
  constructor(options) {
    super(options)
    this.list = this.get('task-list') || []
  }

  saveList() {
    this.set('task-list', this.list)
    return this.list
  }

  getList() {
    this.list = this.get('task-list') || []
    return this.list
  }

  getItem(taskId) {
    this.getList()
    return this.list.find((t) => t.id == taskId)
  }

  addItem(task) {
    this.list = [...this.list, task]
    return this.saveList()
  }

  deleteItem(task) {
    this.list = this.list.filter((t) => t.id !== task.id)
    return this.saveList()
  }

  updateItem(task) {
    this.list = this.list.map((t) => (t.id === task.id ? task : t))
    return this.saveList()
  }
}