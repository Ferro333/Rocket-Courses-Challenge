import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Course } from "../../core/models/course";
import { CourseService } from "../../core/services/course.service";
@Component({
  selector: "app-course-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./course-detail.component.html",
})
export class CourseDetailComponent implements OnInit {
  course?: Course;
  open = new Set<number>();
  constructor(
    private route: ActivatedRoute,
    private service: CourseService,
  ) {}
  ngOnInit() {
    this.service
      .get(this.route.snapshot.paramMap.get("id")!)
      .subscribe((v) => (this.course = v));
  }
  lessons() {
    return this.course?.modules.reduce((n, m) => n + m.lessons.length, 0) || 0;
  }
  toggle(i: number) {
    this.open.has(i) ? this.open.delete(i) : this.open.add(i);
  }
}
