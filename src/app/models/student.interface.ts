import { Course } from './course.interface';

export interface Student {
  id?: number;
  studentNumber: number;
  firstName: string;
  surname: string;
  course: Course[];
}
