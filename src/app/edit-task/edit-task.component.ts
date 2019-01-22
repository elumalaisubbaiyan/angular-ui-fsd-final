import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task';
import { TasksApiService } from '../tasks-api.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  task: Task;

  constructor(private route: ActivatedRoute, 
    private  tasksService: TasksApiService,
     private router: Router) { }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.paramMap.get('taskId'));
    this.tasksService.getTaskById(id).subscribe(
      data => { this.task = data },
      err => { console.error(`Error occured while getting book data ${err}`) }
    );
  }

  goBack() {
    this.router.navigateByUrl("/books");
  }


}
