import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { Task } from '../task';
import { DateValidator } from '../validators/DateValidator';
import { TasksApiService } from '../tasks-api.service';
import { Options } from 'ng5-slider';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormModalComponent } from '../modal/user-form-modal/user-form-modal.component';
import { ProjectFormModalComponent } from '../modal/project-form-modal/project-form-modal/project-form-modal.component';
import { TaskFormModalComponent } from '../modal/task-form-modal/task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent implements OnInit {

  taskForm;
  loaded;
  addTaskResponse;
  addTaskError;
  tasksList;
  priority;
  editMode: boolean;
  viewMode: boolean;
  options: Options = {
    floor: 0,
    ceil: 30
  };
  isParentTask: boolean = false;

  clearFields() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.isParentTask = false;
    this.taskForm = this.fb.group({
      projectId: ['', Validators.required],
      projectName: [''],
      taskId: [],
      parentTask: [''],
      parentTaskId: [''],
      task: ['', [Validators.required]],
      priority: [0, Validators.min(1)],
      startDate: [DateValidator.toDateInputValue(new Date()), [Validators.required]],
      endDate: [DateValidator.toDateInputValue(tomorrow), [Validators.required]],
      userId: [],
      userName: ['']
    }, {
        validator: Validators.compose([
          DateValidator.dateLessThan('endDate', 'startDate', { 'enddate': true })])
      }
    );
    this.priority = 0;
    this.addTaskResponse = '';
    this.addTaskError = '';
  }

  constructor(private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private taskService: TasksApiService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.spinner.show();
    const id = + this.route.snapshot.paramMap.get('taskId');
    this.clearFields();
    if (id && id !== 0) {
      this.taskService.getTaskById(id).subscribe(
        data => {
          this.populateFormOnLoad(data);
          this.spinner.hide();
          this.loaded = true;
        },
        err => {
          console.error(`Error occured while getting task data ${err}`)
          this.spinner.hide();
          this.loaded = true;
        }
      );

    } else {
      this.spinner.hide();
      this.loaded = true;
    }

  }

  public ngViewAfterInit() {
    this.cd.detectChanges();
  }

  toggleTaskFields(e) {
    if (e.target.checked) {
      this.cd.detectChanges();
      this.disableFields();
      this.cd.detectChanges();
    } else {
      this.cd.detectChanges();
      this.enableFields();
      this.cd.detectChanges();
    }
  }

  
  disableFields() {
    this.taskForm.controls['priority'].disable();
    this.taskForm.controls['startDate'].disable();
    this.taskForm.controls['startDate'].setValue('');
    this.taskForm.controls['endDate'].disable();
    this.taskForm.controls['endDate'].setValue('');
    this.taskForm.controls['parentTaskId'].setValue('');
    this.taskForm.controls['parentTask'].setValue('');
    this.taskForm.controls['userId'].setValue('');
    this.taskForm.controls['userName'].setValue('');
    this.isParentTask = true;
    this.options = Object.assign({}, this.options, { disabled: true });
  }

  enableFields() {
    this.taskForm.controls['priority'].enable();
    this.taskForm.controls['startDate'].enable();
    this.taskForm.controls['endDate'].enable();
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.taskForm.controls['startDate'].setValue(DateValidator.toDateInputValue(new Date()));
    this.taskForm.controls['endDate'].setValue(DateValidator.toDateInputValue(tomorrow));
    this.isParentTask = false;
    this.options = Object.assign({}, this.options, { disabled: false });
  }

  openProjectFormModal() {
    const modalRef = this.modalService.open(ProjectFormModalComponent);

    modalRef.result.then((result) => {
      if (result && result.projectId) {
        this.taskForm.controls['projectId'].setValue(result.projectId);
        this.taskForm.controls['projectName'].setValue(result.projectName);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openUserFormModal() {
    const modalRef = this.modalService.open(UserFormModalComponent);

    modalRef.result.then((result) => {
      if (result && result.userId) {
        this.taskForm.controls['userId'].setValue(result.userId);
        this.taskForm.controls['userName'].setValue(result.userName);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openParentTaskFormModal() {
    const modalRef = this.modalService.open(TaskFormModalComponent);

    modalRef.result.then((result) => {
      if (result && result.taskId) {
        this.taskForm.controls['parentTaskId'].setValue(result.taskId);
        this.taskForm.controls['parentTask'].setValue(result.task);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  populateFormOnLoad(data) {
    if (data.status === 'Closed') {
      this.viewMode = true;
    } else {
      this.editMode = true;
    }
    if (data.markedParent && data.markedParent === true) {
      this.isParentTask = true;
      this.disableFields();
    }
    this.taskForm = this.fb.group({
      taskId: [data.taskId],
      projectId: [data.projectId],
      projectName: [data.projectName && data.projectName.projectName],
      task: [data.task, [Validators.required]],
      parentTaskId: [''],
      parentTask: [data.parentTask],
      priority: [data.priority, Validators.min(1)],
      startDate: [data.startDate, [Validators.required]],
      endDate: [data.endDate, [Validators.required]],
      userId: [data.userId],
      userName: [data.user && (data.user.firstName + " " + data.user.lastName)]
    }, {
        validator: Validators.compose([
          DateValidator.dateLessThan('endDate', 'startDate', { 'enddate': true })])
      }
    );
    this.priority = data.priority;
    if (this.viewMode) {
      this.cd.detectChanges();
      this.options = Object.assign({}, this.options, { disabled: true });
      this.taskForm.disable();
      this.cd.detectChanges();
    }
  }


  prettyPrint(rawJson: string) {
    var ugly = rawJson;
    var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(obj, undefined, 4);
    console.log("Successfully added task and received response " + pretty);
    this.addTaskResponse = pretty;
    if (!this.editMode) {
      alert("Successfully added new task");
    } else {
      alert("Successfully updated task");
    }
  }

  onCancel() {
    this.router.navigate(['/tasks']);
  }

  getSubmittedFormData(): Task {
    let taskFormData = this.taskForm.value;
    let taskObj = new Task();
    if (this.editMode) {
      taskObj.taskId = taskFormData.taskId;
    }
    taskObj.projectId = taskFormData.projectId;
    taskObj.task = taskFormData.task;
    taskObj.markedParent = this.isParentTask;

    if (!this.isParentTask) {
      taskObj.parentTaskId = taskFormData.parentTaskId;
      taskObj.priority = taskFormData.priority;
      taskObj.startDate = taskFormData.startDate;
      taskObj.endDate = taskFormData.endDate;
      taskObj.userId = taskFormData.userId;
    }
    console.log("taskObj " + JSON.stringify(taskObj));
    return taskObj;
  }

  onSubmit() {
    this.spinner.show();
    if (this.taskForm.valid && !this.taskForm.hasError('enddate')) {
      this.addTaskResponse = '';
      let taskObj = this.getSubmittedFormData();
      if (this.editMode) {
        this.taskService.updateTask(taskObj.taskId, taskObj).subscribe(
          (data) => {
            this.prettyPrint(JSON.stringify(data));
            this.addTaskError = '';
            this.router.navigate(['/task', taskObj.taskId]);
            this.spinner.hide();
          },
          err => {
            console.error("Error occured when updaating task " + err);
            this.addTaskError = 'Update Task Failed. Please try again';
            this.spinner.hide();
          });
      }
      else {
        this.taskService.addTask(taskObj).subscribe(
          (data) => {
            this.prettyPrint(JSON.stringify(data));
            this.addTaskError = '';
            this.clearFields();
            this.spinner.hide();
          },
          err => {
            console.error("Error occured when adding task " + err);
            this.addTaskError = 'Add Task Failed. Please try again';
            this.spinner.hide();
          });
      }
    } else {

      if (this.taskForm.hasError('enddate')) {
        alert("End date cannot be less than start date" + '\n');
        this.spinner.hide();
        return;
      } else {
        const invalid = [];
        const controls = this.taskForm.controls;
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
  }

}
