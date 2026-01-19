
export type View = 'Dashboard' | 'Parcels' | 'Payments' | 'Support' | 'Profile' | 'dashboard' | 'parcels' | 'add' | 'assistant' | 'payments' | 'profile' | 'topup' | 'coverage' | 'pickup' | 'fraud' | 'tickets' | 'summary' | 'advice' | 'notification';

export interface TrackingStep {
  status: string;
  location: string;
  timestamp: string;
  handlerName: string;
  handlerPhone: string;
  hubPhone: string;
  description: string;
}

// Added ParcelStatus enum for better type safety across components
export enum ParcelStatus {
  PENDING = 'Pending',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  RETURNED = 'Returned',
  PARTIAL_DELIVERY = 'Partial Delivery',
  PAID = 'Paid',
  HOLD = 'Hold',
  IN_REVIEW = 'In Review',
  WAITING_APPROVAL = 'Waiting Approval',
  CANCELLED = 'Cancelled'
}

export interface Parcel {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  amount: number;
  exchange: 'Yes' | 'No';
  weight: string;
  note: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Returned' | 'Partial Delivery' | 'Paid' | 'Hold' | 'In Review' | 'Waiting Approval' | 'Cancelled';
  createdAt: string;
  trackingHistory: TrackingStep[];
  // Added type property to fix ParcelManager errors
  type?: 'Pickup' | 'Drop';
}

export type PaymentMethodType = 'Bank' | 'Mobile Banking' | 'Cash';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  // Bank fields
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  branchName?: string;
  routingNo?: string;
  // Mobile Banking fields
  provider?: 'bKash' | 'Rocket' | 'Nagad';
  mobileNumber?: string;
  // Cash fields
  note?: string;
}

export interface Transaction {
  id: string;
  type: 'Top-up' | 'Withdrawal' | 'Order Income' | 'Charge';
  amount: number;
  method?: string;
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
  note?: string;
}

export interface UserProfile {
  merchantId: string;
  name: string;
  shopName: string;
  phone: string;
  contactNumber: string;
  email: string;
  address: string;
  businessType: string;
  website: string;
  joinedAt: string;
  balance: number;
  pickupMode: string;
  defaultPaymentMethod: string;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
}

// Export User as an alias for UserProfile to maintain compatibility with existing components
export type User = UserProfile;
