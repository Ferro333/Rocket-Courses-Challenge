import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Course } from "../../core/models/course";
import { CourseService } from "../../core/services/course.service";
@Component({
  selector: "app-course-list",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./course-list.component.html",
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  searchTerm = "";
  grid = true;
  loading = true;
  deleteTarget: Course | null = null;
  constructor(private service: CourseService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading = true;
    this.service.list().subscribe({
      next: (v) => {
        this.courses = v;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  search() {
    const q = this.searchTerm.trim();
    (q ? this.service.search(q) : this.service.list()).subscribe(
      (v) => (this.courses = v),
    );
  }
  lessons(c: Course) {
    return c.modules.reduce((n, m) => n + m.lessons.length, 0);
  }
  confirmDelete() {
    if (!this.deleteTarget?.id) return;
    this.service.remove(this.deleteTarget.id).subscribe(() => {
      this.deleteTarget = null;
      this.load();
    });
  }
}
