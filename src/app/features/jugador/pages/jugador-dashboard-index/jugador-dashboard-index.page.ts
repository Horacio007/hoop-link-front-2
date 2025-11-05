import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { } from '@ionic/angular/standalone';

@Component({
  selector: 'app-jugador-dashboard-index',
  templateUrl: './jugador-dashboard-index.page.html',
  styleUrls: ['./jugador-dashboard-index.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class JugadorDashboardIndexPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
