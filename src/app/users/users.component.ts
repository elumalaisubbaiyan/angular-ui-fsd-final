import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersApiServiceService } from './service/users-api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from './user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userForm;
  loaded;
  loadError;
  serviceResponse;
  serviceError;
  usersList;
  editMode: boolean;
  viewMode: boolean;
  public searchText: string;
  sortBy: string;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private userService: UsersApiServiceService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.sortBy = 'firstName';
    this.initializeForm();
    const userId = + this.route.snapshot.paramMap.get('userId');
    this.populateUsers();
    if (userId && userId !== 0) {
      this.userService.getUserById(userId).subscribe(
        data => {
          this.populateUserFormOnLoad(data);
        },
        err => { console.error(`Error occured while getting user data ${err}`) }
      );
    }
  }

  clearFields() {
    this.editMode = false;
    this.initializeForm();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      userId: [],
      employeeId: ['', [Validators.required, Validators.pattern('[0-9]{1,12}')]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
    this.serviceResponse = '';
    this.serviceError = '';
  }

  populateUserFormOnLoad(data) {
    this.editMode = true;
    window.scroll(0, 0);
    this.userForm = this.fb.group({
      userId: [data.userId],
      lastName: [data.lastName, [Validators.required]],
      firstName: [data.firstName, [Validators.required]],
      employeeId: [data.employeeId, [Validators.required, Validators.pattern('[0-9]{1,12}')]],
    });
  }

  populateUsers() {
    this.userService.getAllUsers().subscribe(
      data => {
        this.usersList = data;
        this.spinner.hide();
        this.loaded = true;
        this.loadError = '';
      },
      err => {
        console.error(`Error occured while getting users data ${err}`);
        this.loadError = 'Error occured while getting users data  ';
        this.spinner.hide();
        this.loaded = true;
      }
    );
  }

  onEdit(user: User) {
    this.populateUserFormOnLoad(user);
  }

  onDelete(user: User) {
    this.spinner.show();
    this.userService.deleteUser(user.userId).subscribe(
      (data) => {
        this.serviceError = '';
        window.location.reload();
        this.spinner.hide();
      },
      err => {
        console.error("Error occured when Deleting user " + JSON.stringify(err));
        this.serviceError = 'Delete User Failed. Please try again';
        this.spinner.hide();
      });
  }


  onSubmit() {
    this.spinner.show();
    if (this.userForm.valid) {
      this.serviceResponse = '';
      let userObj = this.getSubmittedFormData();
      if (this.editMode) {
        this.userService.updateUser(userObj.userId, userObj).subscribe(
          (data) => {
            //this.prettyPrint(JSON.stringify(data));
            this.serviceError = '';
            window.location.reload();
            this.spinner.hide();
          },
          err => {
            console.error("Error occured when Updating user " + err);
            this.serviceError = 'Update User Failed. Please try again';
            this.spinner.hide();
          });
      }
      else {
        this.userService.addUser(userObj).subscribe(
          (data) => {
            //this.prettyPrint(JSON.stringify(data));
            window.location.reload();
          },
          err => {
            console.error("Error occured when adding user " + err);
            this.serviceError = 'Add User Failed. Please try again';
            this.spinner.hide();
          });
      }
    } else {
      const invalid = [];
      const controls = this.userForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name + '\n');
        }
      }
      this.spinner.hide();
      alert("Form values are invalid. Please verify the below field values " + '\n' + invalid);
      return invalid;
    }
  }

  getSubmittedFormData(): User {
    let userFormData = this.userForm.value;
    let userObj = new User();
    if (this.editMode) {
      userObj.userId = userFormData.userId;
    }
    userObj.firstName = userFormData.firstName;
    userObj.lastName = userFormData.lastName;
    userObj.employeeId = userFormData.employeeId;
    console.log("userObj " + JSON.stringify(userObj));
    return userObj;
  }

}


