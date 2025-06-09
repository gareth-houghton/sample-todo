export type NewTodo = {
  title: string,
  completed: boolean,
  createdAt: Date,
  userId: string
};

export type TodoRecord = {
  id: number,
  title: string,
  completed: boolean,
  createdAt: Date,
  lastUpdated: Date,
  userId: string
}