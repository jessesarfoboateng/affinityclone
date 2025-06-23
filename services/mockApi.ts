// services/mockApi.ts

export interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING';
  senderPhoneNumber?: string;
  recipientPhoneNumber?: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface RecentRecipient {
  id: string;
  name: string;
  phoneNumber: string;
  lastTransaction: string;
  avatar?: string;
}

export interface LoanProduct {
  id: string;
  title: string;
  description: string;
  interestRate: string;
  term: string;
  maxAmount: string;
  icon: string;
  isEligible: boolean;
  eligibilityReason?: string;
}

export const fetchMockAccountData = async (phone: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const balanceData = { balance: 2450.90 };

  const transactionsData: Transaction[] = [
    {
      id: 'txn1',
      type: 'CREDIT',
      amount: 1200,
      description: 'Salary - May',
      date: new Date().toISOString(),
      status: 'COMPLETED',
      senderPhoneNumber: '0244000001',
    },
    {
      id: 'txn2',
      type: 'DEBIT',
      amount: 150,
      description: 'Airtime Purchase',
      date: new Date().toISOString(),
      status: 'COMPLETED',
      recipientPhoneNumber: '0244556789',
    },
    {
      id: 'txn3',
      type: 'DEBIT',
      amount: 100,
      description: 'MoMo Transfer',
      date: new Date().toISOString(),
      status: 'COMPLETED',
      recipientPhoneNumber: '0209887766',
    },
    {
      id: 'txn4',
      type: 'CREDIT',
      amount: 300,
      description: 'Gift Received',
      date: new Date().toISOString(),
      status: 'COMPLETED',
      senderPhoneNumber: '0551231234',
    },
    {
      id: 'txn5',
      type: 'DEBIT',
      amount: 200,
      description: 'DSTV Bill Payment',
      date: new Date().toISOString(),
      status: 'PENDING',
      recipientPhoneNumber: 'DSTV',
    }
  ];

  return {
    balanceData,
    transactionsData,
  };
};

export const fetchMockAccounts = async (phone: string): Promise<Account[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const accountsData: Account[] = [
    {
      id: 'acc1',
      accountNumber: '1234567890',
      accountType: 'Savings Account',
      balance: 2450.90,
      currency: 'GHS',
      status: 'ACTIVE',
    },
    {
      id: 'acc2',
      accountNumber: '0987654321',
      accountType: 'Current Account',
      balance: 1250.50,
      currency: 'GHS',
      status: 'ACTIVE',
    },
    {
      id: 'acc3',
      accountNumber: '1122334455',
      accountType: 'Fixed Deposit',
      balance: 5000.00,
      currency: 'GHS',
      status: 'ACTIVE',
    }
  ];

  return accountsData;
};

export const fetchMockRecentRecipients = async (phone: string): Promise<RecentRecipient[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const recipientsData: RecentRecipient[] = [
    {
      id: 'rec1',
      name: 'John Doe',
      phoneNumber: '+233 20 123 4567',
      lastTransaction: '2 hours ago',
    },
    {
      id: 'rec2',
      name: 'Jane Smith',
      phoneNumber: '+233 20 765 4321',
      lastTransaction: '1 day ago',
    },
    {
      id: 'rec3',
      name: 'Kwame Asante',
      phoneNumber: '+233 24 555 1234',
      lastTransaction: '3 days ago',
    },
    {
      id: 'rec4',
      name: 'Ama Osei',
      phoneNumber: '+233 26 777 8888',
      lastTransaction: '1 week ago',
    }
  ];

  return recipientsData;
};

export const fetchMockLoanProducts = async (phone: string): Promise<LoanProduct[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const loanProductsData: LoanProduct[] = [
    {
      id: 'loan1',
      title: 'Personal Loan',
      description: 'Quick access to funds for personal needs',
      interestRate: '15%',
      term: '12 months',
      maxAmount: 'GHS 10,000',
      icon: 'cash-outline',
      isEligible: true,
    },
    {
      id: 'loan2',
      title: 'Business Loan',
      description: 'Grow your business with flexible financing',
      interestRate: '12%',
      term: '24 months',
      maxAmount: 'GHS 50,000',
      icon: 'business-outline',
      isEligible: false,
      eligibilityReason: 'Requires 6 months of account activity',
    },
    {
      id: 'loan3',
      title: 'Education Loan',
      description: 'Invest in your future with education financing',
      interestRate: '10%',
      term: '36 months',
      maxAmount: 'GHS 30,000',
      icon: 'school-outline',
      isEligible: true,
    },
    {
      id: 'loan4',
      title: 'Emergency Loan',
      description: 'Quick funds for urgent financial needs',
      interestRate: '18%',
      term: '6 months',
      maxAmount: 'GHS 5,000',
      icon: 'medical-outline',
      isEligible: true,
    }
  ];

  return loanProductsData;
};
