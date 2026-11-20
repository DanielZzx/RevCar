import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API } from './api';

export interface Sessao {
  sucesso: boolean;
  logado: boolean;
  login: string | null;
  admin: boolean;
}

// Serviço de autenticação: consulta a sessão no backend e encerra o login.
// A fonte da verdade é o cookie gerenciado pela API; aqui guardamos apenas
// uma cópia da última sessão para uso do menu e do guard de rotas.
@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario: Sessao | null = null;

  constructor(private http: HttpClient) {}

  // Consulta /sessao.php e armazena o resultado (usado ao navegar entre telas).
  sessao(): Observable<Sessao> {
    return this.http.get<Sessao>(`${API}/sessao.php`).pipe(tap((s) => (this.usuario = s)));
  }

  // Encerra a sessão no servidor e limpa o estado local.
  logout(): Observable<unknown> {
    return this.http.post(`${API}/logout.php`, {}).pipe(tap(() => (this.usuario = null)));
  }
}
