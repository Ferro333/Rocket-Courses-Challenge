import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CourseService } from "../../core/services/course.service";
@Component({
  selector: "app-course-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./course-form.component.html",
})
export class CourseFormComponent implements OnInit {
  id: string | null = null;
  submitted = false;
  apiError = "";
  form = this.fb.group({
    name: ["", [Validators.required]],
    category: [""],
    description: ["", [Validators.required, Validators.minLength(10)]],
    modules: this.fb.array<FormGroup>([]),
  });
  constructor(
    private fb: FormBuilder,
    private service: CourseService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.service.get(this.id).subscribe((c) => {
        this.form.patchValue(c);
        c.modules.forEach((m) => this.addModule(m));
      });
    } else this.addModule();
  }
  get modules() {
    return this.form.controls.modules;
  }
  lessons(i: number) {
    return this.modules.at(i).get("lessons") as FormArray<FormGroup>;
  }
  newLesson(name = "") {
    return this.fb.group({ id: [""], name: [name, Validators.required] });
  }
  newModule(data?: any) {
    const g = this.fb.group({
      id: [data?.id || ""],
      name: [data?.name || "", Validators.required],
      lessons: this.fb.array<FormGroup>([]),
    });
    const a = g.get("lessons") as FormArray<FormGroup>;
    (data?.lessons || [{ name: "" }]).forEach((l: any) =>
      a.push(this.newLesson(l.name)),
    );
    return g;
  }
  addModule(data?: any) {
    this.modules.push(this.newModule(data));
  }
  removeModule(i: number) {
    this.modules.removeAt(i);
  }
  addLesson(i: number) {
    this.lessons(i).push(this.newLesson());
  }
  removeLesson(i: number, j: number) {
    this.lessons(i).removeAt(j);
  }
  save() {
    this.submitted = true;
    this.apiError = "";
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue() as any;
    const req = this.id
      ? this.service.update(this.id, value)
      : this.service.create(value);
    req.subscribe({
      next: (c) => this.router.navigate(["/courses", c.id]),
      error: (e) =>
        (this.apiError =
          e?.error?.message || "Não foi possível salvar o curso."),
    });
  }
}
