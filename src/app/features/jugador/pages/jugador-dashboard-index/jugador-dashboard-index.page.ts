import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { NewsBarComponent } from "src/app/layouts/authenticated-layout/components/news-bar/news-bar.component";

@Component({
  selector: 'app-jugador-dashboard-index',
  templateUrl: './jugador-dashboard-index.page.html',
  styleUrls: ['./jugador-dashboard-index.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, CommonModule, FormsModule, NewsBarComponent]
})
export class JugadorDashboardIndexPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
