import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from '../shared/api';
import { Menu } from '../menu/menu';

interface Veiculo { id_carro: number; placa: string; marca: string; modelo: string; ano: number; }
interface Acessorio { id_acessorio: number; nome: string; }
interface RespostaApi { sucesso: boolean; mensagem: string; }

// Associação entre veículo e acessórios: carrega as opções, permite marcar/desmarcar e salvar.
@Component({
  imports: [FormsModule, Menu],
  selector: 'app-veiculo-acessorio',
  styleUrl: '../shared/pagina.css',
  templateUrl: './veiculo-acessorio.html',
})
export class VeiculoAcessorio implements OnInit {
  veiculos: Veiculo[] = [];
  acessorios: Acessorio[] = [];
  id_carro: number | null = null;
  // Set evita duplicatas e facilita marcar/desmarcar acessórios.
  selecionados = new Set<number>();

  erro = '';
  sucesso = '';
  salvando = false;

  private readonly api = `${API}/veiculo_acessorio.php`;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Carrega as opções de acessórios e os veículos disponíveis.
    this.http.get<{ acessorios: Acessorio[] }>(`${API}/acessorio.php`).subscribe({
      next: (res) => { this.acessorios = res.acessorios; this.cdr.markForCheck(); },
      error: () => { this.erro = 'Não foi possível carregar os acessórios.'; this.cdr.markForCheck(); },
    });

    this.http.get<{ veiculos: Veiculo[] }>(`${API}/veiculo.php`).subscribe({
      next: (res) => {
        this.veiculos = res.veiculos;
        // Se veio ?id_carro=... (atalho após cadastrar um veículo), já o seleciona.
        const id = Number(this.route.snapshot.queryParamMap.get('id_carro'));
        if (id && this.veiculos.some((v) => v.id_carro === id)) {
          this.id_carro = id;
          this.aoSelecionarVeiculo();
        }
        this.cdr.markForCheck();
      },
      error: () => { this.erro = 'Não foi possível carregar os veículos.'; this.cdr.markForCheck(); },
    });
  }

  // Busca os acessórios já vinculados ao veículo selecionado.
  aoSelecionarVeiculo() {
    this.erro = '';
    this.sucesso = '';
    this.selecionados = new Set<number>();
    if (this.id_carro === null) return;

    this.http.get<{ acessorios: number[] }>(`${this.api}?id_carro=${this.id_carro}`).subscribe({
      next: (res) => { this.selecionados = new Set(res.acessorios); this.cdr.markForCheck(); },
      error: () => { this.erro = 'Não foi possível carregar os acessórios do veículo.'; this.cdr.markForCheck(); },
    });
  }

  // Mantém o Set sincronizado com as caixas de seleção do template.
  alternar(id: number, marcado: boolean) {
    this.sucesso = '';
    if (marcado) this.selecionados.add(id);
    else this.selecionados.delete(id);
  }

  // Envia a lista completa de acessórios marcados para o veículo.
  salvar() {
    this.erro = '';
    this.sucesso = '';
    if (this.id_carro === null) { this.erro = 'Selecione um veículo.'; return; }

    this.salvando = true;
    this.http.post<RespostaApi>(this.api, {
      id_carro: this.id_carro,
      acessorios: Array.from(this.selecionados),
    }).subscribe({
      next: (res) => { this.sucesso = res.mensagem; this.salvando = false; this.cdr.markForCheck(); },
      error: (e) => {
        this.erro = e.error?.mensagem ?? 'Erro ao conectar com o servidor.';
        this.salvando = false;
        this.cdr.markForCheck();
      },
    });
  }

  irParaAcessorio() { this.router.navigate(['/cadastro-acessorio']); }
  irParaVeiculo() { this.router.navigate(['/cadastro-veiculo']); }
}
