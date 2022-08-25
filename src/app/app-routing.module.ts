import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskRecordsComponent } from './task-records/task-records.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path:"", component:DashboardComponent},
  {path:"dashboard", component:DashboardComponent},
  {path:"task-records/:duedate", component:TaskRecordsComponent},
  {path:"add-task", component:AddTaskComponent},
  {path:"calendar", component:CalendarViewComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
