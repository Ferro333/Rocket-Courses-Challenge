import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Course } from "../models/course";

@Injectable({ providedIn: "root" })
export class CourseService {
  private readonly api = "http://localhost:3000/courses";
  constructor(private http: HttpClient) {}
  list(): Observable<Course[]> {
    return this.http.get<Course[]>(this.api);
  }
  search(name: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.api}/search`, { params: { name } });
  }
  get(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.api}/${id}`);
  }
  create(course: Course): Observable<Course> {
    return this.http.post<Course>(this.api, course);
  }
  update(id: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.api}/${id}`, course);
  }
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
