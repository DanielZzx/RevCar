import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListagemVeiculos } from './listagem-veiculos';

describe('ListagemVeiculos', () => {
  let component: ListagemVeiculos;
  let fixture: ComponentFixture<ListagemVeiculos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemVeiculos],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListagemVeiculos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
