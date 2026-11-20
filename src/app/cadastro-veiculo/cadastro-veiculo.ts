import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from '../shared/api';
import { Menu } from '../menu/menu';

interface Marca { id_marca: number; nome: string; }
interface Modelo { id_modelo: number; nome: string; }
interface RespostaApi { sucesso: boolean; mensagem: string; id_carro?: number; }

// Cadastro de veículo: carrega as marcas, busca os modelos da marca escolhida e envia o formulário.
@Component({
  imports: [FormsModule, Menu],
  selector: 'app-cadastro-veiculo',
  styleUrl: '../shared/pagina.css',
  templateUrl: './cadastro-veiculo.html',
})
export class CadastroVeiculo implements OnInit {
  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  id_marca: number | null = null;
  id_modelo: number | null = null;
  placa = '';
  chassi = '';
  cor = '';
  ano: number | null = null;
  quilometragem: number | null = null;
  valor: number | null = null;
  situacao = '';

  erro = '';
  sucesso = '';
  ultimoId: number | null = null;
  salvando = false;

  readonly situacoes = ['novo', 'seminovo', 'levemente avariado', 'avariado'];

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Carrega as marcas para o primeiro select.
    this.http.get<{ marcas: Marca[] }>(`${API}/marca.php`).subscribe({
      next: (res) => { this.marcas = res.marcas; this.cdr.markForCheck(); },
      error: () => { this.erro = 'Não foi possível carregar as marcas.'; this.cdr.markForCheck(); },
    });
  }

  // Ao trocar a marca, limpa o modelo selecionado e busca os modelos correspondentes.
  aoMudarMarca() {
    this.id_modelo = null;
    this.modelos = [];
    if (this.id_marca === null) return;
    this.http.get<{ modelos: Modelo[] }>(`${API}/modelo.php?id_marca=${this.id_marca}`).subscribe({
      next: (res) => { this.modelos = res.modelos; this.cdr.markForCheck(); },
      error: () => { this.erro = 'Não foi possível carregar os modelos.'; this.cdr.markForCheck(); },
    });
  }

  enviarFormulario() {
    this.erro = '';
    this.sucesso = '';
    this.ultimoId = null;

    // Validação mínima no cliente; a API também valida os dados.
    if (this.id_modelo === null) { this.erro = 'Selecione a marca e o modelo.'; return; }
    if (!this.placa.trim() || !this.chassi.trim() || !this.cor.trim() || !this.situacao
        || this.ano === null || this.quilometragem === null || this.valor === null) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    this.salvando = true;
    this.http.post<RespostaApi>(`${API}/veiculo.php`, {
      id_modelo: this.id_modelo,
      placa: this.placa,
      chassi: this.chassi,
      cor: this.cor,
      ano: this.ano,
      quilometragem: this.quilometragem,
      valor: this.valor,
      situacao: this.situacao,
    }).subscribe({
      next: (res) => {
        this.sucesso = res.mensagem;
        // Guarda o id retornado para oferecer o atalho de vincular acessórios.
        this.ultimoId = res.id_carro ?? null;
        this.placa = ''; this.chassi = ''; this.cor = '';
        this.ano = null; this.quilometragem = null; this.valor = null; this.situacao = '';
        this.salvando = false;
        this.cdr.markForCheck();
      },
      error: (e) => {
        this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.';
        this.salvando = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Abre a tela de associação já com o veículo recém-cadastrado selecionado.
  vincularAcessorios() {
    this.router.navigate(['/veiculo-acessorio'], { queryParams: { id_carro: this.ultimoId } });
  }
}
