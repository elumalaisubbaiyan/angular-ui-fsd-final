import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { AddTaskComponent } from './add-task/add-task.component';

import { PriorityFilterPipe } from './pipes/priority-filter.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UsersComponent } from './users/users.component';
import { GrdFilterPipe } from './pipes/grd-filter.pipe';
import { TextFilterPipe } from './pipes/text-filter.pipe';
import { ArraySortPipe } from './pipes/array-sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TasksListComponent,
    AddTaskComponent,
    GrdFilterPipe,
    PriorityFilterPipe,
    UsersComponent,
    TextFilterPipe,
    ArraySortPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
