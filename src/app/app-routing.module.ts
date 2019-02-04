import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { UsersComponent } from './users/users.component';
import { ProjectsComponent } from './projects/projects.component';

const routes:  Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { title: 'Manage Project ' }
  },
  {
    path: 'tasks',
    component: TasksListComponent,
    data: { title: 'List of Available Tasks' }
  }, 
  {
    path: 'users',
    component: UsersComponent,
    data: { title: 'Manage User ' }
  },
  {
    path: 'add-task',
    component: AddTaskComponent,
    data: { title: 'Add Task ' }
  },
  {
    path: 'task/:taskId',
    component: AddTaskComponent,
    data: { title: 'Edit Task ' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
