import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/angular';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task } from '../models/task';
import { DataService } from '../services/data.service';

// Method to group objects based on property key
const groupBy = <T>(keys: (keyof T)[]) => (array: T[]): Record<string, T[]> =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map((key) => obj[key]).join('-');
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {} as Record<string, T[]>);

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {

  modalRef?: BsModalRef;
  inProgressTasks: Task[] = [];
  openTasks: Task[] = [];
  closedTasks: Task[] = [];
  pendingCalendarEvents: any[] = [];

  // Full calendar configs
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    navLinks: false,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleDateClick.bind(this),
    events: [],
    customButtons: {
      addTask: {
        text: 'Add Task',
        click: () => {
          this.addTask();
        }
      }
    },
    headerToolbar: {
      right: 'addTask',
      center: 'title',
      left: 'prev,next today'
    }
  };

  constructor(private router: Router, private dataService: DataService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  // Method to open add task modal on button click
  addTask() {
    const initialState: ModalOptions = {
      initialState: {
        title: "Add Task",
        action: "add",
      }
    }
    this.modalRef = this.modalService.show(AddTaskComponent, initialState);
  }

  // Method to get all 
  getAllTasks() {
    this.dataService.getAllTask().subscribe({
      next: (tasks: Task[]) => {
        // Filter and update based on task type
        tasks.forEach(task => {
          if (task.status == "In Progress") {
            this.inProgressTasks.push(task);
          } else if (task.status == "Open") {
            this.openTasks.push(task);
          } else {
            this.closedTasks.push(task);
          }
        });
        this.groupTasksOnDuedate();
      },
      error: (err) => console.log("CalendarViewComponent :: GetAllTasks :: Error fetching tasks : " + err),
      complete: () => console.log("CalendarViewComponent :: GetAllTasks :: Success")
    });
  }

  groupTasksOnDuedate() {
    const groupByDate = groupBy(['duedate']); // Pass property name to group the objects

    // Get the count of In Progress tasks based duedate and construct calendar event object
    for (let [groupName, count] of Object.entries(groupByDate(this.inProgressTasks))) {
      groupName = groupName.split("-").reverse().join("-");
      let dateArr = groupName.split("-");
      dateArr[1] = ('0' + dateArr[1]).slice(-2);
      dateArr[2] = ('0' + dateArr[2]).slice(-2);
      groupName = dateArr.join("-");
      let calendarEvent: any = {
        title: "In Progress : " + count.length,
        start: groupName,
        backgroundColor: '#7FBA00',
      };
      this.pendingCalendarEvents.push(calendarEvent);
    }

    // Get the count of Open tasks based duedate and construct calendar event object
    for (let [groupName, count] of Object.entries(groupByDate(this.openTasks))) {
      groupName = groupName.split("-").reverse().join("-");
      let dateArr = groupName.split("-");
      dateArr[1] = ('0' + dateArr[1]).slice(-2);
      dateArr[2] = ('0' + dateArr[2]).slice(-2);
      groupName = dateArr.join("-");
      let calendarEvent: any = {
        title: "Open Tasks : " + count.length,
        start: groupName,
        backgroundColor: '#FFB900'
      };
      this.pendingCalendarEvents.push(calendarEvent);
    }

    // Get the count of Closed tasks based duedate and construct calendar event object
    for (let [groupName, count] of Object.entries(groupByDate(this.closedTasks))) {
      groupName = groupName.split("-").reverse().join("-");
      let dateArr = groupName.split("-");
      dateArr[1] = ('0' + dateArr[1]).slice(-2);
      dateArr[2] = ('0' + dateArr[2]).slice(-2);
      groupName = dateArr.join("-");
      let calendarEvent: any = {
        title: "Closed Tasks : " + count.length,
        start: groupName,
        backgroundColor: '#F44336'
      };
      this.pendingCalendarEvents.push(calendarEvent);
    }

    // Update the id for each calendar event object
    let task = 1;
    this.pendingCalendarEvents.forEach(f => {
      f.id = task.toString();
      task++;
    })
    this.calendarOptions.events = this.pendingCalendarEvents;
  }

  // Navigate to task records page based on date click
  handleDateClick(arg: any) {
    let duedate = "";
    if (arg.date) {
      duedate = arg.dateStr.replace(/-0+/g, '-').split("-").reverse().join("-");
    } else {
      duedate = arg.event.startStr.replace(/-0+/g, '-').split("-").reverse().join("-");
    }
    this.router.navigate(["/task-records", duedate])
  }

}
