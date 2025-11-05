import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-jugador-dashboard-index',
  templateUrl: './jugador-dashboard-index.page.html',
  styleUrls: ['./jugador-dashboard-index.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class JugadorDashboardIndexPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
