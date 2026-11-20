import { Routes } from '@angular/router';
import { Login } from './login/login';
import { CadastroUsuario } from './cadastro-usuario/cadastro-usuario';
import { CadastroMarca } from './cadastro-marca/cadastro-marca';
import { CadastroModelo } from './cadastro-modelo/cadastro-modelo';
import { CadastroVeiculo } from './cadastro-veiculo/cadastro-veiculo';
import { CadastroAcessorio } from './cadastro-acessorio/cadastro-acessorio';
import { VeiculoAcessorio } from './veiculo-acessorio/veiculo-acessorio';
import { ListagemVeiculos } from './listagem-veiculos/listagem-veiculos';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  // Rotas públicas: a primeira página é sempre o login.
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: CadastroUsuario },

  // Telas internas (exigem login)
  { path: 'veiculos', component: ListagemVeiculos, canActivate: [authGuard] },
  { path: 'cadastro-veiculo', component: CadastroVeiculo, canActivate: [authGuard] },
  { path: 'cadastro-acessorio', component: CadastroAcessorio, canActivate: [authGuard] },
  { path: 'veiculo-acessorio', component: VeiculoAcessorio, canActivate: [authGuard] },
  { path: 'cadastro-marca', component: CadastroMarca, canActivate: [authGuard] },
  { path: 'cadastro-modelo', component: CadastroModelo, canActivate: [authGuard] },

  // Rota coringa: qualquer caminho desconhecido volta para o login.
  { path: '**', redirectTo: 'login' }
];
