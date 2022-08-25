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

  getAllTask() : Observable<Task[]>{
    return this.dbService.getAll('Tasks');
  }

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

  deleteTask(taskId : number) : Observable<Task[]>{
    return this.dbService.delete('Tasks', taskId);
  }

  getTasksByCalendar(duedate : string) : Observable<Task[]>{
    return this.dbService.getAllByIndex('Tasks', 'duedate', IDBKeyRange.only(duedate));
  }

  getInProgress(duedate : string) : Observable<Task[]>{
    return this.dbService.getAllByIndex('Tasks', 'duedate', IDBKeyRange.only(duedate));
  }

}
