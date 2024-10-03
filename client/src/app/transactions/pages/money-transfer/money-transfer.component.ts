import { Component } from '@angular/core';
import { TransactionService } from '../../services/transation.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-money-transfer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.scss',
})
export class MoneyTransferComponent {
  transferForm: FormGroup;
  users: any[] = [];
  senderBalance: number | null = null;
  receiverBalance: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  get selectedCurrency(): string {
    return this.transferForm.get('currency')?.value || 'USD';
  }

  get selectedLocale(): string {
    return this.transferForm.get('locale')?.value || 'en-US';
  }

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.transferForm = this.fb.group({
      currency: ['USD', Validators.required],
      locale: ['en-US', Validators.required],
      senderId: ['', Validators.required],
      receiverId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.transferForm
      .get('currency')
      ?.valueChanges.subscribe(() => this.updateBalances());
    this.transferForm
      .get('locale')
      ?.valueChanges.subscribe(() => this.updateBalances());
  }

  loadUsers() {
    this.transactionService.getUsers().subscribe(
      (users) => (this.users = users),
      (error) => console.error('Error loading users:', error)
    );
  }

  updateBalances() {
    this.updateSenderBalance();
    this.updateReceiverBalance();
  }

  updateSenderBalance() {
    const senderId = this.transferForm.get('senderId')?.value;
    if (senderId) {
      this.transactionService.getUserBalance(senderId).subscribe(
        (response) =>
          (this.senderBalance = this.convertCurrency(response.balance)),
        (error) => console.error('Error loading sender balance:', error)
      );
    }
  }

  updateReceiverBalance() {
    const receiverId = this.transferForm.get('receiverId')?.value;
    if (receiverId) {
      this.transactionService.getUserBalance(receiverId).subscribe(
        (response) =>
          (this.receiverBalance = this.convertCurrency(response.balance)),
        (error) => console.error('Error loading receiver balance:', error)
      );
    }
  }

  convertCurrency(amount: number): number {
    const rates = { USD: 1, EUR: 0.84, GBP: 0.72, JPY: 110.14 };
    return amount * rates[this.selectedCurrency as keyof typeof rates];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.selectedLocale, {
      style: 'currency',
      currency: this.selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  onSubmit() {
    if (this.transferForm.valid) {
      const { senderId, receiverId, amount, currency } =
        this.transferForm.value;
      const amountInUSD = amount / this.convertCurrency(1);
      this.transactionService
        .sendMoney(senderId, receiverId, amountInUSD)
        .subscribe(
          (response) => {
            this.successMessage = 'Transaction successful';
            this.errorMessage = null;
            this.updateBalances();
          },
          (error) => {
            this.errorMessage = error.error.error || 'Transaction failed';
            this.successMessage = null;
          }
        );
    }
  }
}
