import { Student } from '../models/student.interface';
import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { StudentService } from '../services/student.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
})
export class StudentComponent {
  students: Student[] = [];
  studentToAdd: Student[] = [];
  error: string;
  currentOp = 'All student';
  message = '';
  uploadForm: FormGroup;

  constructor(
    private studentService: StudentService,
    private papa: Papa,
    private formBuilder: FormBuilder
  ) {
    this.creatInput();
  }

  getStudents(): any {
    this.studentService.getStudents().subscribe(
      (data: Student[]) => {
        this.students = data;
      },
      (error) => {
        this.toast(true, error);
      }
    );
  }

  uploadStudent(students): any {
    this.studentService.uploadStudent(students).subscribe(
      (data) => {
        this.students = data;
        this.toast(false, this.studentToAdd.length + ' students added');
      },
      (error) => {
        this.toast(true, error);
      }
    );
  }

  fileSelect(event): any {
    // get uploaded file
    const file: File = event.target.files[0];

    // make sure to check the file type before processing
    if (file.name.includes('csv')) {
      // read contents of the file
      this.papa.parse(file, {
        // add header to each row
        header: true,
        // uses a stream so we can get one row at a time
        step: (row) => {
          // descturcturing each row, keys have spaces so we need to use []
          const {
            ['Course Code']: courseCode,
            ['Course Description']: description,
            ['Grade']: grade,
            ['Student Number']: studentNumber,
            Firstname: firstName,
            Surname: surname,
          } = row.data;
          // add row to studentToAdd
          this.studentToAdd.push({
            studentNumber,
            firstName,
            surname,
            course: [{ code: courseCode, description, grade }],
          });
        },
        complete: (results) => {
          // send students to server
          this.uploadStudent(this.studentToAdd);
          this.currentOp = 'Students uploaded Recently';
          this.uploadForm.reset();
        },
      });
    } else {
      this.students = []; // clear list
      this.toast(true, 'Please upload a csv file');
    }
  }

  toast(isError: boolean, message): any {
    // check whether error or just message and assign variable accordingly
    isError ? (this.error = message) : (this.message = message);
    // mimic a toast
    setTimeout(() => {
      isError ? (this.error = '') : (this.message = '');
    }, 3000);
  }

  // create input
  creatInput(): void {
    // create form
    this.uploadForm = this.formBuilder.group({
      uploadInput: '',
    });
  }
}
