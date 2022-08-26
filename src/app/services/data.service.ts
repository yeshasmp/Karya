import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private dbService: NgxIndexedDBService, private router: Router) { }

  // Method to get all tasks from IndexedDb
  getAllTask() : Observable<Task[]>{
    return this.dbService.getAll('Tasks');
  }

  // Method to add task to IndexedDb
  addTask(task: Task): Observable<Task> {
    return this.dbService.add('Tasks', {
      type: task.type,
      title: task.title,
      description: task.description,
      priority: task.priority,
      createdOn: task.createdOn,
      duedate: task.duedate,
      status: task.status
    });
  }

  // Method to update task in IndexedDb
  updateTask(task: Task): Observable<Task> {
    return this.dbService
      .update('Tasks', {
        id:task.id,
        type: task.type,
        title: task.title,
        description: task.description,
        priority: task.priority,
        createdOn: task.createdOn,
        duedate: task.duedate,
        status: task.status
      });
  }

  // Method to delete task from IndexedDb
  deleteTask(taskId : number) : Observable<Task[]>{
    return this.dbService.delete('Tasks', taskId);
  }

  // Method to fetch task by duedate
  getTasksByCalendar(duedate : string) : Observable<Task[]>{
    return this.dbService.getAllByIndex('Tasks', 'duedate', IDBKeyRange.only(duedate));
  }

}
