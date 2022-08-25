import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

//ngx-indexed-db imports
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

// ng-bootstrap imports
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Full Calendar imports
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// ngx-charts
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Custom components
import { AppComponent } from './app.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskRecordsComponent } from './task-records/task-records.component';
import { NavComponent } from './nav/nav.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

const dbConfig: DBConfig  = {
  name: 'TaskDb',
  version: 1,
  objectStoresMeta: [{
    store: 'Tasks',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'type', keypath: 'type', options: { unique: false } },
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'description', keypath: 'description', options: { unique: false } },
      { name: 'priority', keypath: 'priority', options: { unique: false } },
      { name: 'createdOn', keypath: 'createdOn', options: { unique: false } },
      { name: 'duedate', keypath: 'duedate', options: { unique: false } },
      { name: 'status', keypath: 'status', options: { unique: false } },
    ]
  }]
};

@NgModule({
  declarations: [
    AppComponent,
    AddTaskComponent,
    TaskRecordsComponent,
    NavComponent,
    PageNotFoundComponent,
    CalendarViewComponent,
    DashboardComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig),
    FullCalendarModule,
    NgxChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
