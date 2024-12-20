import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AuthService } from "./services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-project';

  constructor(private authService: AuthService) { }

  // 仅当用户已登录时才显示 Header
  shouldShowHeader(): boolean {
    // console.log(this.authService.isLoggedIn());
    return this.authService.isLoggedIn();
  }
}
