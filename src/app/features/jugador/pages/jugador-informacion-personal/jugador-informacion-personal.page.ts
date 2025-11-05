import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderAuthenticatedComponent } from "src/app/layouts/authenticated-layout/components/header-authenticated/header-authenticated.component";
import { FooterComponent } from "src/app/layouts/components/footer/footer.component";

@Component({
  selector: 'app-jugador-informacion-personal',
  templateUrl: './jugador-informacion-personal.page.html',
  styleUrls: ['./jugador-informacion-personal.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderAuthenticatedComponent, FooterComponent]
})
export class JugadorInformacionPersonalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
