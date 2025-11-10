import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JugadorTestPage } from './jugador-test.page';

describe('JugadorTestPage', () => {
  let component: JugadorTestPage;
  let fixture: ComponentFixture<JugadorTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JugadorTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
