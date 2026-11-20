import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroUsuario } from './cadastro-usuario';

describe('CadastroUsuario', () => {
  let component: CadastroUsuario;
  let fixture: ComponentFixture<CadastroUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroUsuario],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
