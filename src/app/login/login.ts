import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface RespostaApi {
  sucesso: boolean;
  mensagem: string;
}

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  login = '';
  password = '';
  erro = '';

  private readonly api = 'http://localhost/apis-revendedora/login.php';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  enviarFormulario() {
    this.erro = '';

    this.http
      .post<RespostaApi>(this.api, { login: this.login, senha: this.password }, { withCredentials: true })
      .subscribe({
        next: () => {
          this.router.navigate(['/veiculos']);
        },
        error: (e) => {
          this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.';
          this.cdr.markForCheck();
        },
      });
  }

  cadastro() {
    this.router.navigate(['/cadastro']);
  }
}