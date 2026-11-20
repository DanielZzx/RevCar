import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroMarca } from './cadastro-marca';

describe('CadastroMarca', () => {
  let component: CadastroMarca;
  let fixture: ComponentFixture<CadastroMarca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMarca],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroMarca);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
