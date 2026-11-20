import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

// Só deixa entrar nas telas internas quem está logado; os demais vão para o login.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const login = router.createUrlTree(['/login']);

  return auth.sessao().pipe(
    map((s) => (s.logado ? true : login)),
    catchError(() => of(login))
  );
};
