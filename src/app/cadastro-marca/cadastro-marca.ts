import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from '../shared/api';
import { Menu } from '../menu/menu';

interface Modelo { id_modelo: number; nome: string; veiculos: number; }
interface Marca { id_marca: number; nome: string; modelos: Modelo[]; veiculos: number; }
interface RespostaApi { sucesso: boolean; mensagem: string; admin?: boolean; marcas?: Marca[]; }

// Item que o administrador está prestes a excluir (marca ou modelo)
interface AlvoExclusao {
  tipo: 'marca' | 'modelo';
  id: number;
  nome: string;
  modelos: number;
  veiculos: number;
}

@Component({
  imports: [FormsModule, Menu],
  selector: 'app-cadastro-marca',
  styleUrl: './cadastro-marca.css',
  templateUrl: './cadastro-marca.html',
})
export class CadastroMarca implements OnInit {
  nome = '';
  erro = '';
  sucesso = '';
  admin = false;
  marcas: Marca[] = [];

  alvo: AlvoExclusao | null = null;
  senhaAdmin = '';
  erroExclusao = '';
  processandoExclusao = false;

  private readonly apiMarca = `${API}/marca.php`;
  private readonly apiModelo = `${API}/modelo.php`;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.carregarMarcas(); }

  carregarMarcas() {
    this.http.get<RespostaApi>(this.apiMarca).subscribe({
      next: (res) => {
        this.marcas = res.marcas ?? [];
        this.admin = !!res.admin;
        this.cdr.markForCheck();
      },
      error: () => { this.erro = 'Não foi possível carregar as marcas cadastradas.'; this.cdr.markForCheck(); },
    });
  }

  enviarFormulario() {
    this.erro = '';
    this.sucesso = '';
    const nome = this.nome.trim();
    if (!nome) { this.erro = 'Informe o nome da marca.'; return; }

    this.http.post<RespostaApi>(this.apiMarca, { nome }).subscribe({
      next: (res) => {
        this.sucesso = res.mensagem;   // confirmação na própria página (sem alert)
        this.nome = '';
        this.carregarMarcas();
        this.cdr.markForCheck();
      },
      error: (e) => { this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.'; this.cdr.markForCheck(); },
    });
  }

  excluirMarca(m: Marca) {
    this.abrirConfirmacao({ tipo: 'marca', id: m.id_marca, nome: m.nome, modelos: m.modelos.length, veiculos: m.veiculos });
  }

  excluirModelo(m: Modelo) {
    this.abrirConfirmacao({ tipo: 'modelo', id: m.id_modelo, nome: m.nome, modelos: 0, veiculos: m.veiculos });
  }

  private abrirConfirmacao(alvo: AlvoExclusao) {
    this.alvo = alvo;
    this.senhaAdmin = '';
    this.erroExclusao = '';
  }

  cancelarExclusao() {
    this.alvo = null;
    this.senhaAdmin = '';
    this.erroExclusao = '';
  }

  confirmarExclusao() {
    if (!this.alvo) return;
    if (!this.senhaAdmin) { this.erroExclusao = 'Digite a senha do administrador para confirmar.'; return; }

    const url = this.alvo.tipo === 'marca' ? this.apiMarca : this.apiModelo;
    this.processandoExclusao = true;
    this.erroExclusao = '';

    this.http.delete<RespostaApi>(`${url}?id=${this.alvo.id}`, { body: { senha: this.senhaAdmin } }).subscribe({
      next: (res) => {
        this.erro = '';
        this.sucesso = res.mensagem;
        this.cancelarExclusao();
        this.processandoExclusao = false;
        this.carregarMarcas();
        this.cdr.markForCheck();
      },
      error: (e) => {
        this.erroExclusao = e.error?.mensagem ?? 'Não foi possível excluir.';
        this.processandoExclusao = false;
        this.cdr.markForCheck();
      },
    });
  }

  irParaModelo() { this.router.navigate(['/cadastro-modelo']); }
}
