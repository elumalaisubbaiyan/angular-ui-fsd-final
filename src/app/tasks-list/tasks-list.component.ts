import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { Router, ActivatedRoute } from '@angular/router';
import { TasksApiService } from '../tasks-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectFormModalComponent } from '../modal/project-form-modal/project-form-modal/project-form-modal.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  taskForm;
  public searchTask: string;
  public searchParentTask: string;
  public searchPriorityFrom: number;
  public searchPriorityTo: number;

  tasksList: Task[] = [];

  constructor(
    private taskService: TasksApiService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.spinner.show();
    this.taskForm = this.taskForm = this.fb.group({
      projectName: ['']
    });

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

  onEdit(task: Task) {
    this.router.navigate(['/task', task.taskId]);
  }

  onEnd(task: Task) {
    this.spinner.show();
    //TODO: Make a update service call for the status update
    task.status = 'Closed';
    console.log("task " + JSON.stringify(task));
    this.taskService.updateTask(task.taskId, task).subscribe(
      (data) => {
        this.spinner.hide();
        window.location.reload();
      },
      err => {
        console.error("Error occured when updating status " + err);
        this.spinner.hide();
      });
    this.taskService.updateTask(task.taskId, task);

  }

  openProjectFormModal() {
    const modalRef = this.modalService.open(ProjectFormModalComponent);

    modalRef.result.then((result) => {
      if (result && result.projectId) {
        //this.taskForm.controls['projectId'].setValue(result.projectId);
        this.taskForm.controls['projectName'].setValue(result.projectName);
        this.spinner.show();
        this.taskService.getAllTasksByProject(result.projectId).subscribe(
          data => {
            this.tasksList = data;
            this.spinner.hide();
          },
          err => {
            console.error(`Error occured while getting tasks data ${err}`);
            this.tasksList = [];
            this.spinner.hide();
          }
        );
      }

    }).catch((error) => {
      console.log(error);
    });
  }

}
