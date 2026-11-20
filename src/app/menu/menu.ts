import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../shared/auth.service';

// Cabeçalho das telas internas: navegação, usuário logado e botão de sair.
@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './menu.css',
  templateUrl: './menu.html',
})
export class Menu {
  // "auth" é público para o template acessar auth.usuario e exibir o login.
  constructor(public auth: AuthService, private router: Router) {}

  sair() {
    // Volta ao login mesmo se a chamada de logout falhar.
    const ir = () => this.router.navigate(['/login']);
    this.auth.logout().subscribe({ next: ir, error: ir });
  }
}
