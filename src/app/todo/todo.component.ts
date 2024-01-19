import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { iTask } from '../model/interfaceTask';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  form: any;

  todoForm!: FormGroup;
  tasks: iTask[] = [];
  inprogress: iTask[] = [];
  done: iTask[] = [];
  updateIndex!: any;
  isEdiEnabled: boolean = false;

  // strick checking of typescript
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    });
  }
  toggleDone(item: iTask, index: number) {
    item.done = !item.done;
    if (item.done) {
      this.done.push(item);
      this.tasks.splice(index, 1);
    } else {
      this.tasks.push(item);
      this.done.splice(index, 1);
    }
    this.saveToLocalStorage();
  }

  onEdit(item: iTask, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = i;
    this.isEdiEnabled = true;
  }

  addTask() {
    this.tasks.push({
      description: this.todoForm.value.item,
      done: false,
    });
    this.saveToLocalStorage(); // Save to local storage after adding a task
    this.todoForm.reset();
  }

  updateTask() {
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEdiEnabled = false;
    this.saveToLocalStorage(); // Save to local storage after updating a task
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
    this.saveToLocalStorage(); // Save to local storage after deleting a task
  }

  deleteInprogress(i: number) {
    this.inprogress.splice(i, 1);
    this.saveToLocalStorage(); // Save to local storage after deleting an in-progress task
  }

  deletedoneTask(i: number) {
    this.done.splice(i, 1);
    this.saveToLocalStorage(); // Save to local storage after deleting a completed task
  }

  drop(event: CdkDragDrop<iTask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.saveToLocalStorage(); // Save to local storage after dropping an item to another list
    }
  }

  // Function to save tasks to local storage
  saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('inprogress', JSON.stringify(this.inprogress));
    localStorage.setItem('done', JSON.stringify(this.done));
  }
}
