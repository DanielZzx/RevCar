import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface RespostaApi {
  sucesso: boolean;
  mensagem: string;
}

// Tela de cadastro de usuário, com validação local de senha antes de chamar a API.
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

  // URL definida diretamente aqui (não usa shared/api.ts) — ver README.
  private readonly api = 'http://localhost/apis-revendedora/cadastro_usuario.php';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  enviarFormulario() {
    this.erro = '';

    // Validações locais antes de enviar para a API.
    if (this.password.length < 5) {
      this.erro = 'A senha deve ter no mínimo 5 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    // O cadastro envia o campo "password" (o login.php usa "senha").
    this.http
      .post<RespostaApi>(this.api, { login: this.login, password: this.password })
      .subscribe({
        next: (res) => {
          // Cadastro concluído: informa o usuário e volta para o login.
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