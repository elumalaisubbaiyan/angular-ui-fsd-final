import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { Router } from '@angular/router';
import { TasksApiService } from '../tasks-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  public searchTask: string;
  public searchParentTask: string;
  public searchPriorityFrom: number;
  public searchPriorityTo: number;

  tasksList: Task[] = [];

  constructor(private taskService: TasksApiService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
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

  onEdit(task) {
    this.router.navigate(['/tasks', task.taskId]);
  }

  onEndTask(task) {
    //TODO: Make a update service call for the status update
  }

}
