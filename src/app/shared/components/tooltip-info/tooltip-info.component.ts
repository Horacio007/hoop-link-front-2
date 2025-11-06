import { Component, Input, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tooltip-info',
  templateUrl: './tooltip-info.component.html',
  styleUrls: ['./tooltip-info.component.scss'],
})
export class TooltipInfoComponent  implements OnInit {

//#region Propiedades
  @Input({required: true}) title!: string;
//#endregion

  constructor() { }

  ngOnInit() {}

}
