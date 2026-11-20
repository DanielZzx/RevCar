import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente raiz: apenas hospeda o <router-outlet>, onde as telas são renderizadas.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}