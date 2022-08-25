import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  modalRef?: BsModalRef;

  constructor(private modalService: BsModalService, private router:Router) { }

  // Method to open add task modal
  addTask() {
    const initialState: ModalOptions = {
      initialState: {
        title: "Add Task",
        action : "add",
      }
    }
    this.modalRef = this.modalService.show(AddTaskComponent, initialState);
  }

}
