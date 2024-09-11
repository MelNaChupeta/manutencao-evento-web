import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/signup">Cadastro</a>
      <a routerLink="/login">Login</a>
    </nav>
    <router-outlet />`,
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'manutencao-equipamento-web';
}

