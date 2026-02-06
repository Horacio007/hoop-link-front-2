import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LogLevel } from '../../../../core/enums';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-banner-space',
  imports: [],
  templateUrl: './banner-space.component.html',
  styleUrl: './banner-space.component.css'
})
export class BannerSpaceComponent implements OnInit, OnDestroy {

//#region Propieades
  // @Input({ required: true })
  // scroll$!: BehaviorSubject<number>;

  // @ViewChild('parallaxImg', { static: true })
  // parallaxImg!: ElementRef<HTMLImageElement>;

  // private scrollSub?: Subscription;
  private readonly _contextLog = 'BannerSpaceComponent';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService) { }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ngOnDestroy(): void {
    // this.scrollSub?.unsubscribe();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }

  ngAfterViewInit(): void {
    // this.scrollSub = this.scroll$.subscribe(scrollTop => {
    //   const speed = 0.3;
    //   this.parallaxImg.nativeElement.style.transform =
    //     `translateY(${scrollTop * speed}px)`;
    // });
  }
//#endregion

//#region Generales




//#endregion

}
