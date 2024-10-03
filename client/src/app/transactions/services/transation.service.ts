// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class TransactionService {
//   constructor(private http: HttpClient) {}

//   // Fetch all users
//   getUsers(): Observable<any> {
//     return this.http.get(`${environment.BASE_URL}/users`);
//   }

//   // Fetch all transactions
//   getTransactions(): Observable<any> {
//     return this.http.get(`${environment.BASE_URL}/transactions`);
//   }

//   // Create a new transaction
//   createTransaction(
//     senderId: number,
//     receiverId: number,
//     amount: number
//   ): Observable<any> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//     });

//     const body = {
//       sender_id: senderId,
//       receiver_id: receiverId,
//       amount: amount,
//     };

//     return this.http.post(`${environment.BASE_URL}/transactions`, body, {
//       headers,
//     });
//   }

//   // Fetch a specific user by ID
//   getUserById(userId: number): Observable<any> {
//     return this.http.get(`${environment.BASE_URL}/users/${userId}`);
//   }

//   // Fetch a specific transaction by ID
//   getTransactionById(transactionId: number): Observable<any> {
//     return this.http.get(
//       `${environment.BASE_URL}/transactions/${transactionId}`
//     );
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000'; // Adjust this to match your API URL

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserBalance(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/balance`);
  }

  sendMoney(
    senderId: number,
    receiverId: number,
    amount: number
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transactions`, {
      senderId,
      receiverId,
      amount,
    });
  }
}
