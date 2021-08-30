import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.interface';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}
  baseURL = 'http://localhost:8080/api';

  // get all students
  getStudents(): Observable<Student[] | any> {
    return this.http
      .get<Student[]>(`${this.baseURL}/student/all`)
      .pipe(catchError(this.errorHandler));
  }

  // send data to backend for further processing
  uploadStudent(student: Student[]): Observable<Student[] | any> {
    return this.http
      .post<Student[]>(`${this.baseURL}/student/add`, student)
      .pipe(catchError(this.errorHandler));
  }

  // handle error
  errorHandler(error: any): any {
    return throwError(
      error.status === 0 ? 'Something went wrong' : error.message
    );
  }
}
