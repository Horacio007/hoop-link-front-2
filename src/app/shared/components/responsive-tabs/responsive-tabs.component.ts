import {
  Component,
  Input,
  ContentChildren,
  TemplateRef,
  QueryList,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
  ViewChildren,
  Renderer2,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Agregar esto
import { ITab } from './interfaces/responsive-tabs.interface';
import { OnInit } from '@angular/core';

import { LoggerService } from '../../../core/services/logger/logger.service';
import { LogLevel } from '../../../core/enums';

@Component({
  selector: 'app-responsive-tabs',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './responsive-tabs.component.html',
  styleUrl: './responsive-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsiveTabsComponent implements OnInit, AfterContentInit, OnDestroy {

//#region Propiedades
  @Input({required: true}) tabLabels: ITab[] = [];

  @ContentChildren('tab') templates!: QueryList<TemplateRef<any>>;
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef>;

  @Output() informacionAlPadre = new EventEmitter<any>();
  @Output() tabChange = new EventEmitter<string>();

  activeTabIndex = 0;
  isMobileView = false;

  private tabConClaseEspecialIndex: number | null = null; // Para rastrear el índice del tab con la clase especial
  private claseEspecial = 'tab-active'; // Nombre de la clase especial

  private readonly _contextLog = 'ResponsiveTabsComponent';
//#endregion Propiedades

//#region Constructor
  constructor(
    private cdr: ChangeDetectorRef, private renderer: Renderer2,
    private readonly _logger: LoggerService
  ) {}
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);
  }

  ngAfterContentInit() {
    if (this.tabLabels.length !== this.templates.length) {
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> ngAfterContentInit`, 'El número de labels no coincide con las secciones.');
    } else {
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngAfterContentInit`, 'Tabs y templates cargados correctamente.');
    }
    this.checkScreenWidth();
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales

  get activeTemplate(): TemplateRef<any> {
    return this.templates.toArray()[this.activeTabIndex];
  }

  selectTab(index: number) {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> selectTab`, `Tab seleccionado: ${index}`);
    this.activeTabIndex = index;
    for (let index = 0; index < this.tabLabels.length; index++) {
      if (this.activeTabIndex !== index) {
        this.removeClassFromTab(index, this.claseEspecial);
      }

    }
    const tabName = this.tabLabels[index].tabName; // Asume que ITab tiene una propiedad 'label' o 'name'
    this.tabChange.emit(tabName);
    // No necesitamos llamar a checkScreenWidth aquí, el cambio de vista se detecta en onResize
    // y el estilo activo se actualiza automáticamente con la condición en el template.
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> onResize`, `Width: ${window.innerWidth}`);
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    const wasMobileView = this.isMobileView;
    this.isMobileView = window.innerWidth < 768; // Ajusta el breakpoint según tu SCSS (md)
    if (wasMobileView !== this.isMobileView) {
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> checkScreenWidth`, `Cambio de vista: ${this.isMobileView ? 'mobile' : 'desktop'}`);
      this.cdr.detectChanges(); // Forzar la detección de cambios al cambiar el tipo de vista
      this.addClassToTab(this.activeTabIndex, this.claseEspecial);
    }
  }

  addClassToTab(index: number, className: string) {
    if (this.tabButtons && this.tabButtons.toArray()[index]) {
      const tabElement = this.tabButtons.toArray()[index].nativeElement;
      this.renderer.addClass(tabElement, className);
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> addClassToTab`, `Clase ${className} añadida al tab ${index}`);
    }
  }

  removeClassFromTab(index: number, className: string) {
    if (this.tabButtons && this.tabButtons.toArray()[index]) {
      const tabElement = this.tabButtons.toArray()[index].nativeElement;
      this.renderer.removeClass(tabElement, className);
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> removeClassFromTab`, `Clase ${className} removida del tab ${index}`);
    }
  }

//#endregion
}
