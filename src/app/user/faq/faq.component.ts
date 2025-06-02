import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],  // necesario para ngIf, ngFor, etc.
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  tabActivo: string = 'faqs';

  constructor() {}

  ngOnInit(): void {
    // lógica inicial si la necesitas
  }

  seleccionarTab(tab: string): void {
    this.tabActivo = tab;
  }
}
