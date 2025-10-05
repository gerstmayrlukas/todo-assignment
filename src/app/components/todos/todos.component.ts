import {Component, computed, effect, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TodoService} from '../../services/todo.service';
import {ActivatedRoute, Router} from '@angular/router';

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
}
