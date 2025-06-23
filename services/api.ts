import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080/api';

interface AccountBalance {
  phoneNumber: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING';
  senderPhoneNumber?: string;
  recipientPhoneNumber?: string;
}

class ApiService {
  private async getHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getAccountBalance(phoneNumber: string): Promise<AccountBalance> {
    const response = await fetch(`${API_BASE_URL}/accounts/${phoneNumber}/balance`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch balance');
    return response.json();
  }

  async getRecentTransactions(phoneNumber: string, limit: number = 10): Promise<Transaction[]> {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${phoneNumber}/transactions?limit=${limit}`,
      {
        headers: await this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  }

  async topUpAccount(phoneNumber: string, amount: number): Promise<Transaction> {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${phoneNumber}/top-up?amount=${amount}`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error('Failed to top up account');
    return response.json();
  }

  async withdrawFromAccount(phoneNumber: string, amount: number): Promise<Transaction> {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${phoneNumber}/withdraw?amount=${amount}`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error('Failed to withdraw from account');
    return response.json();
  }

  async sendMoney(
    senderPhoneNumber: string,
    recipientPhoneNumber: string,
    amount: number
  ): Promise<Transaction> {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${senderPhoneNumber}/send-money?recipientPhoneNumber=${recipientPhoneNumber}&amount=${amount}`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error('Failed to send money');
    return response.json();
  }
}

export const apiService = new ApiService(); 