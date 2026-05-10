import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { FooterComponent } from './shared/components/footer.component';
import { NavbarComponent } from './shared/components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
