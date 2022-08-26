import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Task } from '../models/task';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  title?: string;
  action?: any;
  editTask?: any;

  taskForm!: FormGroup;
  task: Task = {} as Task;
  types: string[] = ["Design", "Bug", "Documentation"];
  status: string[] = ["Open", "In Progress", "Closed"];

  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder, private dataService: DataService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
   }

  ngOnInit(): void {
    this.loadTaskForm(this.action, this.editTask);
  }

  // Prepare reactive form validations for add/edit form based on action received
  loadTaskForm(action: string, task: Task) {
    if (action == "add") {
      this.taskForm = this.formBuilder.group({
        type: ["", Validators.required],
        title: ["", [Validators.required, Validators.maxLength(30)]],
        description: ["", [Validators.required, Validators.maxLength(100)]],
        priority: ["", Validators.required],
        duedate: ["", Validators.required],
        status: ["Open"]
      })
    } else if (action == "edit") {
      this.taskForm = this.formBuilder.group({
        type: [task.type],
        title: [task.title, [Validators.required, Validators.maxLength(30)]],
        description: [task.description, [Validators.required, Validators.maxLength(100)]],
        priority: [task.priority, Validators.required],
        duedate: [task.duedate, Validators.required],
        status: [task.status]
      })
    }
  }

  // Get all form input controls
  get taskFormControls() {
    return this.taskForm.controls;
  }

  // Save task based on add/edit action
  addEditTask(taskForm: FormGroup) {
    if (this.action === "add") {
      var createdDate = new Date();
      var dueDate = taskForm.value.duedate;
      if (typeof dueDate === 'object' && dueDate !== null && 'getDate' in dueDate)
        taskForm.value.duedate = dueDate.getDate() + '-' + (dueDate.getMonth() + 1) + '-' + dueDate.getFullYear();
      this.task = Object.assign(this.task, taskForm.value);
      this.task.createdOn = createdDate.getDate() + '-' + (createdDate.getMonth() + 1) + '-' + createdDate.getFullYear();
      console.log(this.task);
      this.dataService.addTask(this.task).subscribe({
        next: (data) => console.log('AddTaskComponent :: AddEditTask :: Successfully created Task', data),
        error: (err) => console.error('AddTaskComponent :: AddEditTask :: Error adding task : ', err),
        complete: () => {
          this.bsModalRef.hide();
          this.router.navigate(["/task-records", taskForm.value.duedate]);
        }
      });
    } else {
      var createdDate = new Date();
      var dueDate = taskForm.value.duedate;
      if (typeof dueDate === 'object' && dueDate !== null && 'getDate' in dueDate)
        taskForm.value.duedate = dueDate.getDate() + '-' + (dueDate.getMonth() + 1) + '-' + dueDate.getFullYear();
      this.editTask = Object.assign(this.editTask, taskForm.value);
      this.task.createdOn = createdDate.getDate() + '-' + (createdDate.getMonth() + 1) + '-' + createdDate.getFullYear();
      console.log(this.editTask);
      this.dataService.updateTask(this.editTask).subscribe({
        next: (data) => console.log('AddTaskComponent :: AddEditTask :: Successfully updated Task', data),
        error: (err) => console.error('AddTaskComponent :: AddEditTask :: Error updating task : ', err),
        complete: () => {
          this.bsModalRef.hide();
          this.router.navigate(["/task-records", taskForm.value.duedate]);
        }
      });
    }
  }

}
