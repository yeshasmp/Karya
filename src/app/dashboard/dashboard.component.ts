import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task } from '../models/task';
import { ProfileComponent } from '../profile/profile.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  modalRef?: BsModalRef;
  profileName: any = localStorage.getItem('name');
  currentMonthYear: string = new Date?.toLocaleString('default', { month: 'long' }) + ' ' + new Date?.getFullYear().toString();

  // Upcoming and overdue tasks
  upcomingTasks: Task[] = [];
  overdueTasks: any[] = [];

  // Pie chart configs
  openTasksCount: number = 0;
  InProgressTasksCount: number = 0;
  closedTasksCount: number = 0;
  pieChartColorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#75e900', '#ffea00', '#F44336']
  };
  currentMonthTasks: any[] = [
    {
      "name": 'Open',
      "value": this.openTasksCount
    },
    {
      "name": 'In Progress',
      "value": this.InProgressTasksCount
    },
    {
      "name": 'Closed',
      "value": this.closedTasksCount
    },
  ];

  // Line chart configs
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = new Date?.getFullYear().toString();
  yAxisLabel: string = 'Completed Tasks';
  currentYearCompletedTasks: any[] = [
    {
      "name": "Completed Tasks",
      "series": [
        {
          "name": "January",
          "value": 0
        },
        {
          "name": "February",
          "value": 0
        },
        {
          "name": "March",
          "value": 0
        },
        {
          "name": "April",
          "value": 0
        },
        {
          "name": "May",
          "value": 0
        },
        {
          "name": "June",
          "value": 0
        },
        {
          "name": "July",
          "value": 0
        },
        {
          "name": "August",
          "value": 0
        },
        {
          "name": "September",
          "value": 0
        },
        {
          "name": "October",
          "value": 0
        },
        {
          "name": "November",
          "value": 0
        },
        {
          "name": "December",
          "value": 0
        }
      ]
    }
  ];
  lineChartColorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0067FF']
  };

  constructor(private dataService: DataService, private modalService: BsModalService, private router: Router) { }

  ngOnInit(): void {
    // Check for profile name and set
    if (!localStorage.getItem('name')) {
      var config: any = {
        backdrop: 'static'
      }
      this.modalRef = this.modalService.show(ProfileComponent, config);
    }
    this.getCurrentMonthTasksCount();
    this.getCurrenYearCompletedTasksCount();
    this.getUpcomingTasks();
    this.getOverdueTasks();
  }

  // Method to get current month tasks overview
  getCurrentMonthTasksCount() {
    this.dataService.getAllTask().subscribe({
      next: (tasks: Task[]) => {
        // Get current month all tasks
        const currentMonth = Number(new Date().getMonth() + 1);
        const currentMonthTasks = tasks.filter(task => {
          var taskMonth = Number('0' + task.duedate.split('-')[1].slice(-2));
          return taskMonth == currentMonth;
        });
        // Filter and update count based on task type
        currentMonthTasks?.forEach(task => {
          if (task.status == 'Open') {
            this.openTasksCount = ++this.openTasksCount;
            this.currentMonthTasks?.filter(f => {
              if (f?.name == "Open")
                f.value = this.openTasksCount
            })
          } else if (task.status == 'In Progress') {
            this.InProgressTasksCount = ++this.InProgressTasksCount;
            this.currentMonthTasks?.filter(f => {
              if (f?.name == "In Progress")
                f.value = this.InProgressTasksCount
            })
          } else if (task.status == 'Closed') {
            this.closedTasksCount = ++this.closedTasksCount;
            this.currentMonthTasks?.filter(f => {
              if (f?.name == "Closed")
                f.value = this.closedTasksCount
            })
          }
        })
      },
      error: (err) => console.log("DashboardComponent :: GetCurrentMonthsTasksCount :: Error fetching tasks : " + err),
      complete: () => {
        this.currentMonthTasks = [...this.currentMonthTasks];
        console.log("DashboardComponent :: GetCurrentMonthsTasksCount :: Success")
      }
    })
  }

  // Method to get all current month upcoming tasks
  getUpcomingTasks() {
    this.dataService.getAllTask().subscribe({
      next: (tasks: Task[]) => {
        const currentMonth = Number(new Date().getMonth() + 1);
        const today = Number(new Date().getDate());
        tasks.filter((task) => {
          if (task.status == "Open" || task.status == "In Progress") {
            var taskMonth = Number('0' + task.duedate.split('-')[1].slice(-2));
            var taskDate = Number('0' + task.duedate.split('-')[0].slice(-2));
            if (taskMonth >= currentMonth && taskDate > today) {
              this.upcomingTasks.push(task);
            }
          }
        })
      },
      error: (err) => console.log("DashboardComponent :: GetUpcomingTasks :: Error fetching tasks : " + err),
      complete: () => console.log("DashboardComponent :: GetUpcomingTasks :: Success")
    })
  }

  // Method to get all overdue tasks
  getOverdueTasks() {
    this.dataService.getAllTask().subscribe({
      next: (tasks: Task[]) => {
        const currentYear = Number(new Date().getFullYear());
        const currentMonth = Number(new Date().getMonth() + 1);
        tasks.filter((task) => {
          if (task.status == "Open" || task.status == "In Progress") {
            var taskYear = task.duedate.split('-')[2];
            var taskMonth = '0' + task.duedate.split('-')[1].slice(-2);
            var taskDate = '0' + task.duedate.split('-')[0].slice(-2);
            const formattedTaskDate = taskMonth + "/" + taskDate + "/" + taskYear;
            if (Number(taskYear) == currentYear && Number(taskMonth) <= currentMonth) {
              const diff = this.getDifferenceOfDays(formattedTaskDate);
              if (diff > 0) {
                let overdueTask = {
                  id: task.id,
                  type: task.type,
                  title: task.title,
                  description: task.description,
                  priority: task.priority,
                  createdOn: task.createdOn,
                  status: task.status,
                  duedate: task.duedate,
                  overdueDays: diff,
                }
                this.overdueTasks.push(overdueTask);
              }
            }
          }
        });
        this.overdueTasks.sort((a, b) => a.overdueDays - b.overdueDays);
      },
      error: (err) => console.log("DashboardComponent :: GetOverdueTasks :: Error fetching tasks : " + err),
      complete: () => console.log("DashboardComponent :: GetOverdueTasks :: Success")
    })
  }

  //Method to get all current year completed tasks
  getCurrenYearCompletedTasksCount() {
    this.dataService.getAllTask().subscribe({
      next: (tasks: Task[]) => {
        const currentYear = Number(new Date().getFullYear());
        tasks.filter((task) => {
          var taskYear = Number('0' + task.duedate.split('-')[2]);
          var taskMonth = Number('0' + task.duedate.split('-')[1].slice(-2));
          if (task.status == 'Closed' && taskYear == currentYear) {
            switch (taskMonth) {
              case 1:
                this.currentYearCompletedTasks[0].series[0].value = ++this.currentYearCompletedTasks[0].series[0].value;
                break;
              case 2:
                this.currentYearCompletedTasks[0].series[1].value = ++this.currentYearCompletedTasks[0].series[1].value;
                break;
              case 3:
                this.currentYearCompletedTasks[0].series[2].value = ++this.currentYearCompletedTasks[0].series[2].value;
                break;
              case 4:
                this.currentYearCompletedTasks[0].series[3].value = ++this.currentYearCompletedTasks[0].series[3].value;
                break;
              case 5:
                this.currentYearCompletedTasks[0].series[4].value = ++this.currentYearCompletedTasks[0].series[4].value;
                break;
              case 6:
                this.currentYearCompletedTasks[0].series[5].value = ++this.currentYearCompletedTasks[0].series[5].value;
                break;
              case 7:
                this.currentYearCompletedTasks[0].series[6].value = ++this.currentYearCompletedTasks[0].series[6].value;
                break;
              case 8:
                this.currentYearCompletedTasks[0].series[7].value = ++this.currentYearCompletedTasks[0].series[7].value;
                break;
              case 9:
                this.currentYearCompletedTasks[0].series[8].value = ++this.currentYearCompletedTasks[0].series[8].value;
                break;
              case 10:
                this.currentYearCompletedTasks[0].series[9].value = ++this.currentYearCompletedTasks[0].series[9].value;
                break;
              case 11:
                this.currentYearCompletedTasks[0].series[10].value = ++this.currentYearCompletedTasks[0].series[10].value;
                break;
              case 12:
                this.currentYearCompletedTasks[0].series[11].value = ++this.currentYearCompletedTasks[0].series[11].value;
                break;
            }
          }
        })
      },
      error: (err) => console.log("DashboardComponent :: GetCurrenYearCompletedTasksCount :: Error fetching tasks : " + err),
      complete: () => {
        this.currentYearCompletedTasks = [...this.currentYearCompletedTasks];
        console.log("DashboardComponent :: GetCurrenYearCompletedTasksCount :: Success")
      }
    })
  }

  // Method to calculate difference for overdue tasks
  getDifferenceOfDays(formattedTaskDate: any) {
    const taskFullDate = new Date(formattedTaskDate);
    const today = new Date();
    const diffTime = Number(today) - Number(taskFullDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Method to open modal on icon click
  editTask(task: Task) {
    const initialState: ModalOptions = {
      initialState: {
        title: "Edit Task",
        action: "edit",
        editTask: task
      }
    }
    this.modalRef = this.modalService.show(AddTaskComponent, initialState);
  }

}
