import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './menu.css',
  templateUrl: './menu.html',
})
export class Menu {
  constructor(public auth: AuthService, private router: Router) {}

  sair() {
    const ir = () => this.router.navigate(['/login']);
    this.auth.logout().subscribe({ next: ir, error: ir });
  }
}
