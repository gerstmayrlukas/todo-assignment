import {Component, computed, effect, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TodoService} from '../../services/todo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Todo} from '../../models/todo.model';

@Component({
  selector: 'app-todos',
  imports: [
    FormsModule
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {

  selectedStatus = signal<'all' | 'active' | 'done'>('all');

  editingTodoId = signal<string | null>(null);

  lastDeletedTodo = signal<Todo | null>(null)

  showUndoBanner = signal(false)

  private undoTimeout?: number;

  title: string = '';

  filteredTodos = computed(() => {
    const status = this.selectedStatus();
    const allTodos = this.todoService.todoList();

    if (status === 'active') {
      return allTodos.filter(todo => !todo.done);
    } else if (status === 'done') {
      return allTodos.filter(todo => todo.done);
    } else {
      return allTodos;
    }
  });

  remainingCount = computed(() =>
    this.todoService.todoList().filter(todo => !todo.done).length
  );

  completedCount = computed(() =>
    this.todoService.todoList().filter(todo => todo.done).length
  );

  allCount = computed(() =>
    this.todoService.todoList().length
  )

  constructor(
    public todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const statusFromUrl = this.route.snapshot.queryParamMap.get('status');
    if (statusFromUrl === 'active' || statusFromUrl === 'done') {
      this.selectedStatus.set(statusFromUrl);
    }

    effect(() => {
      const filter = this.selectedStatus();

      this.router.navigate([], {
        queryParams: {status: filter === 'all' ? null : filter},
        replaceUrl: true
      });
    });
  }

  setStatus(filter: 'all' | 'active' | 'done') {
    this.selectedStatus.set(filter);
  }


  ngOnInit(): void {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todoService.todoList.set(JSON.parse(storedTodos));
    }
  }

  addNewTodo() {
    if (this.title.trim() === '') {
      window.alert("Type something!")
      this.title = '';
    } else {
      this.todoService.add(this.title);
      this.title = '';
    }
  }

  startEditing(todoId: string) {
    this.editingTodoId.set(todoId);
  }

  saveEditing(todoId: string, newTitle: string) {
    if (newTitle.trim() === '') {
      return;
    }
    this.todoService.updateTitle(todoId, newTitle.trim());

    this.editingTodoId.set(null);
  }

  cancelEdit() {
    this.editingTodoId.set(null)
  }

  deleteTodoWithUndo(id: string) {
    const todos = this.todoService.todoList();
    const todo = todos.find(todo => todo.id === id);

    if(todo){
      this.lastDeletedTodo.set(todo)

      this.showUndoBanner.set(true);

      this.todoService.remove(id);
    }
    if(this.undoTimeout){
      window.clearTimeout(this.undoTimeout);
    }
    this.undoTimeout = window.setTimeout(() => {
      this.showUndoBanner.set(false);

      this.lastDeletedTodo.set(null);
    }, 5000);
  }

  undoDelete() {
    const todo = this.lastDeletedTodo();

    if(todo){
      this.todoService.restore(todo);

      this.showUndoBanner.set(false);

      this.lastDeletedTodo.set(null);
    }

    if (this.undoTimeout) {
      clearTimeout(this.undoTimeout);
    }
  }
}
