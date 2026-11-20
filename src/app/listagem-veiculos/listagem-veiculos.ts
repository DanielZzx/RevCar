import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { API } from '../shared/api';
import { Menu } from '../menu/menu';

interface Veiculo {
  id_carro: number; placa: string; chassi: string; cor: string; ano: number;
  valor: number; quilometragem: number; situacao: string;
  marca: string; modelo: string; acessorios: string[];
}

// Tela de estoque: carrega os veículos da API e permite filtrar a lista em memória.
@Component({
  imports: [FormsModule, Menu],
  selector: 'app-listagem-veiculos',
  styleUrl: '../shared/pagina.css',
  templateUrl: './listagem-veiculos.html',
})
export class ListagemVeiculos implements OnInit {
  veiculos: Veiculo[] = [];
  filtro = '';
  erro = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Busca o estoque ao abrir a tela.
    this.http.get<{ veiculos: Veiculo[] }>(`${API}/veiculo.php`).subscribe({
      next: (res) => { this.veiculos = res.veiculos; this.cdr.markForCheck(); },
      error: () => { this.erro = 'Não foi possível carregar os veículos.'; this.cdr.markForCheck(); },
    });
  }

  // Filtro aplicado no cliente sobre marca, modelo, placa, cor, situação e acessórios.
  get filtrados(): Veiculo[] {
    const t = this.filtro.trim().toLowerCase();
    if (!t) return this.veiculos;
    return this.veiculos.filter((v) =>
      [v.marca, v.modelo, v.placa, v.cor, v.situacao, ...v.acessorios].join(' ').toLowerCase().includes(t)
    );
  }

  // Formata o valor em Real brasileiro.
  moeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Usado para destacar na tabela os veículos avariados.
  avariado(situacao: string): boolean {
    return situacao.includes('avariado');
  }
}
