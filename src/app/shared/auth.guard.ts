import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

// Guard de rota: consulta a sessão na API antes de liberar as telas internas.
// Usuário deslogado ou falha de comunicação redirecionam para /login.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const login = router.createUrlTree(['/login']);

  return auth.sessao().pipe(
    map((s) => (s.logado ? true : login)),
    catchError(() => of(login))
  );
};
