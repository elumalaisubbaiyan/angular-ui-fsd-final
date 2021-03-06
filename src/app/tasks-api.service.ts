import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from './task';
import { NgxSpinnerService } from 'ngx-spinner';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = "/fsdrestservices/tasks";

@Injectable({
  providedIn: 'root'
})

export class TasksApiService {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(apiUrl);
  }

  getAllTasksByProject(projectId: number): Observable<Task[]> {
    const tasksByProjectUrl = `${apiUrl}/projects/${projectId}`;
    return this.http.get<Task[]>(tasksByProjectUrl);
  }

  getParentTasks(): Observable<Task[]> {
    const parentTasksUrl = apiUrl + "/parents";
    return this.http.get<Task[]>(parentTasksUrl);
  }


  getTaskById(id: number): Observable<Task> {
    const getByIdUrl = `${apiUrl}/${id}`;
    return this.http.get<Task>(getByIdUrl);
  }

  addTask(task: Task): Observable<string> {
    return this.http.post<string>(apiUrl, task).pipe(
      catchError(this.handleError('addTask')),
      tap(data => console.log("response data for addtask: ", data))
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    const putByIdUrl = `${apiUrl}/${id}`;
    return this.http.put<Task>(putByIdUrl, task, httpOptions);
  }

  deleteTask(id: number): Observable<Task> {
    const deleteByIdUrl = `${apiUrl}/${id}`;
    return this.http.delete<Task>(deleteByIdUrl);
  }

  private handleError<T>(operation = 'operation', result?: string) {
    return (error: any): Observable<string> => {
      //alert("An error has occured while performing operation " + JSON.stringify(error));
      // TODO: send the error to remote logging infrastructure  
      console.error(error); // log to console instead
      //this.spinner.hide();
      // Let the app keep running by returning an empty result.
      //return of(result as string);   
      throw new Error("Error occured performing operation ");
    };
  }



}
