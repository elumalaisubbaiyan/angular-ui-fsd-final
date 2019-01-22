import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { Task } from '../task';
import { DateValidator } from '../validators/DateValidator';
import { TasksApiService } from '../tasks-api.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent implements OnInit {

  taskForm;
  addTaskResponse;
  addTaskError;
  tasksList;

  clearFields() {
    this.taskForm = this.fb.group({
      parentTask: [0, []],
      task: ['', [Validators.required]],
      priority: [0, Validators.min(1)],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
    this.addTaskResponse = '';
    this.addTaskError = '';
  }

  constructor(private fb: FormBuilder, private taskService: TasksApiService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.clearFields();
    this.spinner.show();
    this.taskService.getAllTasks().subscribe(
      data => {
        this.tasksList = data;
        this.spinner.hide();
      },
      err => {
         console.error(`Error occured while getting tasks data ${err}`);
          this.spinner.hide();
       }
    );
  }

  prettyPrint(rawJson: string) {
    var ugly = rawJson;
    var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(obj, undefined, 4);
    console.log("Successfully added task and received response " + pretty);
    this.addTaskResponse = pretty;
    alert("Successfully added new task");
  }

  onSubmit() {
    this.spinner.show();
    if (this.taskForm.valid) {
      let taskFormData = this.taskForm.value;
      this.addTaskResponse = '';
      let taskObj = new Task();
      console.log("pataskFormDatarentTask "+taskFormData);
      taskObj.parentTaskId = taskFormData.parentTask;
      taskObj.task = taskFormData.task;
      taskObj.priority = taskFormData.priority;
      taskObj.startDate = taskFormData.startDate;
      taskObj.endDate = taskFormData.endDate;
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
