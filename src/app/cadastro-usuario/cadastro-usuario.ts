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
  selector: 'app-cadastro-usuario',
  styleUrl: './cadastro-usuario.css',
  templateUrl: './cadastro-usuario.html',
})
export class CadastroUsuario {
  login = '';
  password = '';
  confirmPassword = '';
  erro = '';

  private readonly api = 'http://localhost/apis-revendedora/cadastro_usuario.php';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  enviarFormulario() {
    this.erro = '';

    if (this.password.length < 5) {
      this.erro = 'A senha deve ter no mínimo 5 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    this.http
      .post<RespostaApi>(this.api, { login: this.login, password: this.password })
      .subscribe({
        next: (res) => {
          alert(res.mensagem);
          this.router.navigate(['/login']);
        },
        error: (e) => {
          this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.';
          this.cdr.markForCheck();
        },
      });
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }
}