import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-jugador-test',
  templateUrl: './jugador-test.page.html',
  styleUrls: ['./jugador-test.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class JugadorTestPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
