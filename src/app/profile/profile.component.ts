import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  profileForm?: NgForm;
  name: string = '';

  constructor(public bsModalRef: BsModalRef, private router: Router) { }

  // Method to save profile name
  save(profileForm:NgForm) {
    if (profileForm?.valid) {
      localStorage.setItem('name', this.name);
      this.router.navigate(['dashboard']);
    }
  }

}
