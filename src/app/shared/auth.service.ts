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

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario: Sessao | null = null;

  constructor(private http: HttpClient) {}

  sessao(): Observable<Sessao> {
    return this.http.get<Sessao>(`${API}/sessao.php`).pipe(tap((s) => (this.usuario = s)));
  }

  logout(): Observable<unknown> {
    return this.http.post(`${API}/logout.php`, {}).pipe(tap(() => (this.usuario = null)));
  }
}
