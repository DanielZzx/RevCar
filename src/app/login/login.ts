import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface RespostaApi {
  sucesso: boolean;
  mensagem: string;
}

// Tela de login: autentica na API e, em caso de sucesso, abre a listagem de veículos.
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

  // URL definida diretamente aqui (não usa shared/api.ts) — ver README.
  private readonly api = 'http://localhost/apis-revendedora/login.php';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  enviarFormulario() {
    // Limpa o erro da tentativa anterior.
    this.erro = '';

    this.http
      .post<RespostaApi>(this.api, { login: this.login, senha: this.password }, { withCredentials: true })
      .subscribe({
        next: () => {
          // Login aceito: a API já definiu o cookie de sessão.
          this.router.navigate(['/veiculos']);
        },
        error: (e) => {
          // Mostra a mensagem enviada pela API ou uma mensagem genérica.
          this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.';
          // A resposta HTTP chega fora do ciclo do Angular; sinaliza a atualização da tela.
          this.cdr.markForCheck();
        },
      });
  }

  cadastro() {
    this.router.navigate(['/cadastro']);
  }
}