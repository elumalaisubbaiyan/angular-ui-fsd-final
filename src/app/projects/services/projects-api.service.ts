import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Project } from '../project';
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const ProjectServiceUrl = "/fsdrestservices/projects";

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(ProjectServiceUrl);
  }

  getProjectById(employeeId: number): Observable<Project> {
    const getByIdUrl = `${ProjectServiceUrl}/${employeeId}`;
    return this.http.get<Project>(getByIdUrl);
  }

  addProject(Project: Project): Observable<string> {
    return this.http.post<string>(ProjectServiceUrl, Project).pipe(
      catchError(this.handleError('addProject')),
      tap(data => console.log("response data for addProject: ", data))
    );
  }

  updateProject(employeeId: number, Project: Project): Observable<Project> {
    const putByIdUrl = `${ProjectServiceUrl}/${employeeId}`;
    return this.http.put<Project>(putByIdUrl, Project, httpOptions);
  }

  deleteProject(ProjectId: number): Observable<Project> {
    const deleteByIdUrl = `${ProjectServiceUrl}/${ProjectId}`;
    return this.http.delete<Project>(deleteByIdUrl);
  }

  private handleError<T>(operation = 'operation', result?: string) {
    return (error: any): Observable<string> => {
      console.error(error); // log to console instead
      throw new Error("Error occured performing operation ");
    };
  }
}
