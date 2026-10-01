import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: ` <header class="topbar">
      <a routerLink="/" class="brand"
        ><span>✦</span><b>Rocket</b><small>COURSES</small></a
      ><a routerLink="/" class="nav-pill">▦ Cursos</a
      ><a routerLink="/courses/new" class="btn primary">＋ NOVO CURSO</a>
    </header>
    <router-outlet />`,
})
export class AppComponent {}
