import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task } from '../models/task';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-task-records',
  templateUrl: './task-records.component.html',
  styleUrls: ['./task-records.component.css']
})
export class TaskRecordsComponent implements OnInit {

  tasks : Task[] = [];
  modalRef?: BsModalRef;
  openTasks? : Task[];
  closedTasks? : Task[];
  inProgressTasks? : Task[];

  constructor(private dataService : DataService, private modalService: BsModalService, private router : Router, private route : ActivatedRoute) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const duedate = routeParams.get('duedate');
    this.getTasksByDate(duedate);
  }
  
  // Method to get tasks by date
  getTasksByDate(duedate : any){
    this.dataService.getTasksByCalendar(duedate).subscribe({
      next : (data : Task[]) => this.tasks = data,
      error : (err) => console.log("TaskRecordsComponent :: GetTasksByDate :: Error fetching tasks : " + err),
      complete : () => {
        this.groupTasksByType();
        console.log("TaskRecordsComponent :: GetTasksByDate :: Success")
      }
    })
  }

  // Method to open edit task modal
  editTask(task : Task){
    const initialState: ModalOptions = {
      initialState: {
        title : "Edit Task",
        action : "edit",
        editTask : task
      }
    }
    this.modalRef = this.modalService.show(AddTaskComponent, initialState);
    this.modalRef.onHide?.subscribe(() => { 
      const routeParams = this.route.snapshot.paramMap;
      const duedate = routeParams.get('duedate');
      this.getTasksByDate(duedate);
    });
  }

  // Method to delete task
  deleteTask(taskId : number){
    this.dataService.deleteTask(taskId).subscribe({
      error : (err) => console.log("TaskRecordsComponent :: DeleteTask :: Error deleting task : " + err),
      complete : () => {
        console.log("TaskRecordsComponent :: DeleteTask :: Success");
        this.router.navigate(["calendar"]);
      }
    })
  }

  // Method to classify tasks based on task type 
  groupTasksByType(){
    this.openTasks = this.tasks.filter(f => f.status == "Open");
    this.closedTasks = this.tasks.filter(f => f.status == "Closed");
    this.inProgressTasks = this.tasks.filter(f => f.status == "In Progress");
  }

}
