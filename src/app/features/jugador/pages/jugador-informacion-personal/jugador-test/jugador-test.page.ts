import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jugador-test',
  templateUrl: './jugador-test.page.html',
  styleUrls: ['./jugador-test.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class JugadorTestPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
