import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const userServiceUrl = "/fsdrestservices/users";

@Injectable({
  providedIn: 'root'
})
export class UsersApiServiceService {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(userServiceUrl);
  }

  getUserById(employeeId: number): Observable<User> {
    const getByIdUrl = `${userServiceUrl}/${employeeId}`;
    return this.http.get<User>(getByIdUrl);
  }

  addUser(user: User): Observable<string> {
    return this.http.post<string>(userServiceUrl, user).pipe(
      catchError(this.handleError('addUser')),
      tap(data => console.log("response data for addUser: ", data))
    );
  }

  updateUser(employeeId: number, user: User): Observable<User> {
    const putByIdUrl = `${userServiceUrl}/${employeeId}`;
    return this.http.put<User>(putByIdUrl, user, httpOptions);
  }

  deleteUser(userId: number): Observable<User> {
    const deleteByIdUrl = `${userServiceUrl}/${userId}`;
    return this.http.delete<User>(deleteByIdUrl);
  }

  private handleError<T>(operation = 'operation', result?: string) {
    return (error: any): Observable<string> => {
      console.error(error); // log to console instead
      //this.spinner.hide();
      throw new Error("Error occured performing operation ");
    };
  }
}