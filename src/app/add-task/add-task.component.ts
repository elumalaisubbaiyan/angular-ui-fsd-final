import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { Task } from '../task';
import { DateValidator } from '../validators/DateValidator';
import { TasksApiService } from '../tasks-api.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  clearFields() {
    this.taskForm = this.fb.group({
      taskId: [],
      parentTask: [0, []],
      task: ['', [Validators.required]],
      priority: [0, Validators.min(1)],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
    this.priority = 0;
    this.addTaskResponse = '';
    this.addTaskError = '';
  }

  constructor(private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private taskService: TasksApiService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    const id = + this.route.snapshot.paramMap.get('taskId');
    this.clearFields();
    this.populateParentTaskList();
    if (id && id !== 0) {
      this.taskService.getTaskById(id).subscribe(
        data => {
          this.populateFormOnLoad(data);
        },
        err => { console.error(`Error occured while getting task data ${err}`) }
      );
    }
  }

  public ngViewAfterInit() {
    this.cd.detectChanges();
  }

  populateParentTaskList() {
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

  populateFormOnLoad(data) {
    if (data.status === 'Closed') {
      this.viewMode = true;
    } else {
      this.editMode = true;
    }

    this.taskForm = this.fb.group({
      taskId: [data.taskId],
      parentTask: [data.parentTaskId, [Validators.required]],
      task: [data.task, [Validators.required]],
      priority: [data.priority, Validators.min(1)],
      startDate: [data.startDate, [Validators.required]],
      endDate: [data.endDate, [Validators.required]],
    });
    this.priority = data.priority;
    if (this.viewMode) {
      this.cd.detectChanges();
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
    taskObj.parentTaskId = taskFormData.parentTask;
    taskObj.task = taskFormData.task;
    taskObj.priority = taskFormData.priority;
    taskObj.startDate = taskFormData.startDate;
    taskObj.endDate = taskFormData.endDate;
    console.log("taskObj " + JSON.stringify(taskObj));
    return taskObj;
  }

  onSubmit() {
    this.spinner.show();
    if (this.taskForm.valid) {
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
