export interface PaymentMethod {
  id: string
  type: "upi" | "card" | "netbanking" | "wallet"
  name: string
  icon: string
  isDefault?: boolean
}

export interface UPIProvider {
  id: string
  name: string
  icon: string
  upiId?: string
}

export interface PaymentRequest {
  amount: number
  currency: string
  description: string
  recipientName: string
  recipientUPI?: string
  teacherId?: string
  paymentType: "salary" | "course_fee" | "bonus" | "reimbursement"
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  message: string
  timestamp: string
}

export interface PaymentHistory {
  id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "cancelled"
  timestamp: string
  description: string
  method: string
  transactionId?: string
}
