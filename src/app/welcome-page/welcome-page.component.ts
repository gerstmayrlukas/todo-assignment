import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  welcomeText = 'WELCOME BACK! On the buttons above, you can switch to your todos!'
}
