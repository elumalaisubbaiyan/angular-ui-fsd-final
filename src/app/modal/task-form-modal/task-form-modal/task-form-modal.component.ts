import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TasksApiService } from 'src/app/tasks-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Task } from 'src/app/task';

@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.css']
})
export class TaskFormModalComponent implements OnInit {
  taskLookupForm: FormGroup;
  tasksList;
  selectedTask;
  loaded;

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private taskService: TasksApiService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.initializeForm();

    this.taskService.getAllTasks().subscribe(
      data => {
        this.tasksList = data;
        this.spinner.hide();
        this.loaded = true;
      },
      err => {
        console.error(`Error occured while getting tasks data ${err}`);
        this.spinner.hide();
        this.loaded = true;
      }
    );
  }

  onchange(task: Task) {
    this.selectedTask = {
      'taskId': task.taskId,
      'task': task.task
    }
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  private initializeForm() {
    this.taskLookupForm = this.formBuilder.group({
      taskId: '',
      task: ''
    });
  }
  private submitForm() {
    this.activeModal.close(this.selectedTask);
  }

}
