import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/users/user';
import { UsersApiServiceService } from 'src/app/users/service/users-api-service.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.component.html',
  styleUrls: ['./user-form-modal.component.css']
})
export class UserFormModalComponent implements OnInit {

  userLookupForm: FormGroup;
  usersList;
  selectedUser;
  loaded;

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UsersApiServiceService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.initializeForm();

    this.userService.getAllUsers().subscribe(
      data => {
        this.usersList = data;
        this.spinner.hide();
        this.loaded = true;
      },
      err => {
        console.error(`Error occured while getting projects data ${err}`);
        this.spinner.hide();
        this.loaded = true;
      }
    );
  }

  onchange(user: User) {
    this.selectedUser = {
      'userId': user.userId,
      'userName': user.firstName + " " + user.lastName
    }
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  private initializeForm() {
    this.userLookupForm = this.formBuilder.group({
      userId: '',
      userName: ''
    });
  }
  private submitForm() {
    this.activeModal.close(this.selectedUser);
  }

}
