import { HttpInterceptorFn } from '@angular/common/http';

// Envia o cookie de sessão do PHP em todas as chamadas à API.
export const credenciaisInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ withCredentials: true }));
