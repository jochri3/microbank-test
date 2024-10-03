import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MoneyTransferComponent } from "./transactions/pages/money-transfer/money-transfer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MoneyTransferComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
