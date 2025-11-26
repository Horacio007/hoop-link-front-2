import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NewsBarComponent } from "src/app/layouts/authenticated-layout/components/news-bar/news-bar.component";

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.page.html',
  styleUrls: ['./coach-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NewsBarComponent]
})
export class CoachDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
