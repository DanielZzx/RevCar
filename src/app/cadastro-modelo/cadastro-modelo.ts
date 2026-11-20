import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from '../shared/api';
import { Menu } from '../menu/menu';

interface Marca {
  id_marca: number;
  nome: string;
}

interface RespostaApi {
  sucesso: boolean;
  mensagem: string;
}

interface RespostaMarcas {
  sucesso: boolean;
  marcas: Marca[];
}

// Cadastro de modelo: o modelo é sempre vinculado a uma marca existente.
@Component({
  imports: [FormsModule, Menu],
  selector: 'app-cadastro-modelo',
  styleUrl: './cadastro-modelo.css',
  templateUrl: './cadastro-modelo.html',
})
export class CadastroModelo implements OnInit {
  nome = '';
  id_marca: number | null = null;
  marcas: Marca[] = [];
  erro = '';
  sucesso = '';

  private readonly apiMarca = `${API}/marca.php`;
  private readonly apiModelo = `${API}/modelo.php`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarMarcas();
  }

  // Carrega as marcas disponíveis para o select.
  carregarMarcas() {
    this.http.get<RespostaMarcas>(this.apiMarca).subscribe({
      next: (res) => {
        this.marcas = res.marcas ?? [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.erro = 'Não foi possível carregar as marcas.';
        this.cdr.markForCheck();
      },
    });
  }

  enviarFormulario() {
    this.erro = '';
    this.sucesso = '';

    const nome = this.nome.trim();

    // Validação local antes de enviar para a API.
    if (this.id_marca === null) {
      this.erro = 'Selecione a marca.';
      return;
    }

    if (nome === '') {
      this.erro = 'Informe o nome do modelo.';
      return;
    }

    this.http
      .post<RespostaApi>(this.apiModelo, { id_marca: this.id_marca, nome })
      .subscribe({
        next: (res) => {
          this.sucesso = res.mensagem;
          this.nome = '';
          this.cdr.markForCheck();
        },
        error: (e) => {
          this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.';
          this.cdr.markForCheck();
        },
      });
  }

  irParaMarca() {
    this.router.navigate(['/cadastro-marca']);
  }
}