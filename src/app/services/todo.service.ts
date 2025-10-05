import {Injectable, signal} from '@angular/core';
import {Todo} from '../models/todo.model';
import {effect} from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todoList = signal<Todo[]>([]);

  constructor() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todoList.set(JSON.parse(savedTodos));
    }

    effect(() => {
      const todos = this.todoList();
      localStorage.setItem('todos', JSON.stringify(todos))
    })
  }

  add(title: string) {
    this.todoList.update(todos => [
      ...todos,
      {
        id: Date.now().toString(),
        title: title.trim(),
        done: false
      }]);
  }

  toggle(id: string) {
    this.todoList.update(todos =>
      todos.map(todo =>
        todo.id === id
          ? {...todo, done: !todo.done} : todo)
    )
  }

  remove(id: string) {
    this.todoList.update(todos =>
      todos.filter(todo => todo.id !== id)
    );
  }

  removeAll() {
    this.todoList.set([]);
    localStorage.removeItem("todos");
  }
}
