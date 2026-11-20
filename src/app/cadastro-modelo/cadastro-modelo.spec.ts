import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroModelo } from './cadastro-modelo';

describe('CadastroModelo', () => {
  let component: CadastroModelo;
  let fixture: ComponentFixture<CadastroModelo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroModelo],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroModelo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
