export interface Lesson {
  id?: string;
  name: string;
}
export interface CourseModule {
  id?: string;
  name: string;
  lessons: Lesson[];
}
export interface Course {
  id?: string;
  name: string;
  description: string;
  category?: string;
  modules: CourseModule[];
}
