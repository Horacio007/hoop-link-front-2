import { Component, OnInit, Input } from '@angular/core';
import { IonButtons, IonToolbar, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header-authenticated',
  templateUrl: './header-authenticated.component.html',
  styleUrls: ['./header-authenticated.component.scss'],
  imports: [IonMenuButton, IonButtons, IonToolbar]
})
export class HeaderAuthenticatedComponent  implements OnInit {

//#region Propiedades
  @Input() pageTitle!: string;
//#endregion

  constructor() { }

  ngOnInit() {}

}
