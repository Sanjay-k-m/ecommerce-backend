// --------------------
// User & Auth
// --------------------
export interface IRole {
  id: string;
  name: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IUser {
  id: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  email: string;
  username?: string;
  password: string;
  roles: string[];
  phone?: string;
  isEmailVerified: boolean;
  currentHashedRefreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  otp?: string;
  otpExpiry?: Date;
  lastLogin?: Date;
  failedLoginAttempts: number;
  status: 'active' | 'suspended' | 'deleted';
  lastPasswordChange?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  socialProvider?: string;
  socialId?: string;
  loginIp?: string;
  loginUserAgent?: string;
  previousPasswords?: string[];
  securityQuestions?: string[];
  mfaRecoveryCodes?: string[];

  addresses?: IAddress[];
  cart?: ICart[];
  orders?: IOrder[];
  wishlist?: IWishlist[];
  reviews?: IReview[];
  notifications?: INotification[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// --------------------
// Address
// --------------------
export interface IAddress {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// --------------------
// Categories & Subcategories
// --------------------
export interface ICategory {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'deleted';
  subcategories?: ISubcategory[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ISubcategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  status: 'active' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// --------------------
// Products & Inventory
// --------------------
export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: string;
  subcategoryId?: string;
  status: 'active' | 'deleted';
  media?: IMedia[];
  reviews?: IReview[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// --------------------
// Cart & Wishlist
// --------------------
export interface ICart {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------
// Orders, Payments & Shipping
// --------------------
export interface IOrder {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  payment?: IPayment;
  shipping?: IShipping;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IPayment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IShipping {
  id: string;
  orderId: string;
  addressId?: string;
  carrier: string;
  trackingNo?: string;
  status: 'pending' | 'shipped' | 'delivered' | 'returned';
  createdAt: Date;
  updatedAt: Date;
}

// --------------------
// Coupons
// --------------------
export interface ICoupon {
  id: string;
  code: string;
  discount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// --------------------
// Reviews & Returns
// --------------------
export interface IReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IReturn {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------
// Media & Notifications
// --------------------
export interface IMedia {
  id: string;
  url: string;
  type: string;
  productId?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  id: string;
  userId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------
// Analytics & Settings
// --------------------
export interface IAnalytics {
  id: string;
  key: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISetting {
  id: string;
  key: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}
