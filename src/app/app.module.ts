import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PriorityFilterPipe } from './pipes/priority-filter.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UsersComponent } from './users/users.component';
import { GrdFilterPipe } from './pipes/grd-filter.pipe';
import { TextFilterPipe } from './pipes/text-filter.pipe';
import { ArraySortPipe } from './pipes/array-sort.pipe';
import { ProjectsComponent } from './projects/projects.component';
import { SimpleSliderComponent } from './slider/simple-slider/simple-slider.component';
import { Ng5SliderModule } from 'ng5-slider';
import { UserFormModalComponent } from './modal/user-form-modal/user-form-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksListComponent,
    AddTaskComponent,
    GrdFilterPipe,
    PriorityFilterPipe,
    UsersComponent,
    TextFilterPipe,
    ArraySortPipe,
    ProjectsComponent,
    SimpleSliderComponent,
    UserFormModalComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    Ng5SliderModule,
    NgxSpinnerModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    UserFormModalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
