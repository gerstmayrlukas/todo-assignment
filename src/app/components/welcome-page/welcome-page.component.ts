import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  welcomeText = 'Welcome back! Use the buttons above to switch to your todos!'
}
