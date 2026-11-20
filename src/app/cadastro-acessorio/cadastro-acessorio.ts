import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { API } from '../shared/api';
import { Menu } from '../menu/menu';

interface Acessorio { id_acessorio: number; nome: string; }
interface RespostaApi { sucesso: boolean; mensagem: string; acessorios?: Acessorio[]; }

// Cadastro e listagem de acessórios.
@Component({
  imports: [FormsModule, Menu],
  selector: 'app-cadastro-acessorio',
  styleUrl: '../shared/pagina.css',
  templateUrl: './cadastro-acessorio.html',
})
export class CadastroAcessorio implements OnInit {
  nome = '';
  erro = '';
  sucesso = '';
  acessorios: Acessorio[] = [];

  private readonly api = `${API}/acessorio.php`;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.carregar(); }

  // Busca a lista de acessórios cadastrados.
  carregar() {
    this.http.get<RespostaApi>(this.api).subscribe({
      next: (res) => { this.acessorios = res.acessorios ?? []; this.cdr.markForCheck(); },
      error: () => { this.erro = 'Não foi possível carregar os acessórios.'; this.cdr.markForCheck(); },
    });
  }

  enviarFormulario() {
    this.erro = '';
    this.sucesso = '';
    const nome = this.nome.trim();
    if (!nome) { this.erro = 'Informe o nome do acessório.'; return; }

    // Cadastra o acessório e recarrega a listagem para exibir o novo item.
    this.http.post<RespostaApi>(this.api, { nome }).subscribe({
      next: (res) => { this.sucesso = res.mensagem; this.nome = ''; this.carregar(); this.cdr.markForCheck(); },
      error: (e) => { this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.'; this.cdr.markForCheck(); },
    });
  }
}
