"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  CreditCard,
  Smartphone,
  Wallet,
  Building,
  Loader2,
  Shield,
  ArrowRight,
  QrCode,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentMethod, UPIProvider, PaymentResponse } from "@/lib/payment-types"

const paymentMethods: PaymentMethod[] = [
  { id: "upi", type: "upi", name: "UPI", icon: "smartphone", isDefault: true },
  { id: "card", type: "card", name: "Credit/Debit Card", icon: "credit-card" },
  { id: "netbanking", type: "netbanking", name: "Net Banking", icon: "building" },
  { id: "wallet", type: "wallet", name: "Digital Wallet", icon: "wallet" },
]

const upiProviders: UPIProvider[] = [
  { id: "gpay", name: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
  { id: "phonepe", name: "PhonePe", icon: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" },
  { id: "paytm", name: "Paytm", icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
  { id: "bhim", name: "BHIM", icon: "https://upload.wikimedia.org/wikipedia/en/6/65/BHIM_SVG_Logo.svg" },
  { id: "amazonpay", name: "Amazon Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/2/29/Amazon_Pay_logo.svg" },
]


interface UPIPaymentProps {
  teacherName: string
  teacherId: string
  defaultAmount?: number
  paymentType?: "salary" | "course_fee" | "bonus" | "reimbursement"
  onPaymentComplete?: (response: PaymentResponse) => void
}

export function UPIPayment({
  teacherName,
  teacherId,
  defaultAmount = 0,
  paymentType = "salary",
  onPaymentComplete,
}: UPIPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0])
  const [selectedUPIProvider, setSelectedUPIProvider] = useState<UPIProvider | null>(null)
  const [amount, setAmount] = useState(defaultAmount.toString())
  const [upiId, setUpiId] = useState("")
  const [description, setDescription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [showQR, setShowQR] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const processingSteps = [
    "Validating payment details...",
    "Connecting to payment gateway...",
    "Processing payment...",
    "Confirming transaction...",
  ]

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingStep((prev) => {
          if (prev < processingSteps.length - 1) {
            return prev + 1
          } else {
            clearInterval(interval)
            // Simulate payment completion
            setTimeout(() => {
              const success = Math.random() > 0.2 // 80% success rate
              setPaymentStatus(success ? "success" : "failed")
              setIsProcessing(false)

              const response: PaymentResponse = {
                success,
                transactionId: success ? `TXN${Date.now()}` : undefined,
                message: success ? "Payment completed successfully" : "Payment failed. Please try again.",
                timestamp: new Date().toISOString(),
              }

              onPaymentComplete?.(response)
            }, 1000)
            return prev
          }
        })
      }, 1500)

      return () => clearInterval(interval)
    }
  }, [isProcessing, onPaymentComplete])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    if (selectedMethod.type === "upi" && !upiId) {
      newErrors.upiId = "Please enter UPI ID"
    }

    if (selectedMethod.type === "upi" && upiId && !isValidUPIId(upiId)) {
      newErrors.upiId = "Please enter a valid UPI ID"
    }

    if (!description.trim()) {
      newErrors.description = "Please enter payment description"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUPIId = (id: string): boolean => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
    return upiRegex.test(id)
  }

  const handlePayment = () => {
    if (!validateForm()) return
    setShowConfirmDialog(true)
  }

  const confirmPayment = () => {
    setShowConfirmDialog(false)
    setIsProcessing(true)
    setProcessingStep(0)
    setPaymentStatus("processing")
  }

  const resetPayment = () => {
    setPaymentStatus("idle")
    setIsProcessing(false)
    setProcessingStep(0)
    setErrors({})
  }

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId)
  }

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case "smartphone":
        return <Smartphone className="h-5 w-5" />
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "building":
        return <Building className="h-5 w-5" />
      case "wallet":
        return <Wallet className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  if (paymentStatus === "success") {
    return (
      <Card className="w-full max-w-md mx-auto sm:px-4 lg:px-6">
        <CardContent className="pt-6">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ₹{amount} has been sent to {teacherName}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">TXN{Date.now()}</p>
            </div>
            <Button onClick={resetPayment} className="w-full">
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === "failed") {
    return (
      <Card className="w-full max-w-md mx-auto sm:px-4 lg:px-6">
        <CardContent className="pt-6">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Payment Failed</h3>
              <p className="text-sm text-muted-foreground mt-1">Unable to process payment. Please try again.</p>
            </div>
            <div className="space-y-2">
              <Button onClick={resetPayment} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isProcessing) {
    return (
      <Card className="w-full max-w-md mx-auto sm:px-4 lg:px-6">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Processing Payment</h3>
              <p className="text-sm text-muted-foreground mt-1">{processingSteps[processingStep]}</p>
            </div>
            <div className="space-y-2">
              <Progress value={(processingStep + 1) * 25} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Step {processingStep + 1} of {processingSteps.length}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-xs text-amber-800">Please don't close this window or navigate away</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-2 sm:px-4 lg:px-6">
      {/* Payment Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment to {teacherName}</span>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure payment powered by UPI</span>
          </div>
        </CardHeader>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={cn(
                  "p-4 border rounded-lg transition-all duration-200 hover:shadow-md",
                  selectedMethod.id === method.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="flex flex-col items-center space-y-2">
                  {getMethodIcon(method.icon)}
                  <span className="text-sm font-medium">{method.name}</span>
                  {method.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UPI Payment Form */}
      {selectedMethod.type === "upi" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">UPI Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* UPI Provider Selection */}
            <div className="space-y-3">
              <Label>Choose UPI App (Optional)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {upiProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedUPIProvider(provider)}
                    className={cn(
                      "p-3 border rounded-lg transition-all duration-200 hover:shadow-sm",
                      selectedUPIProvider?.id === provider.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Image src={provider.icon} alt={provider.name} width={32} height={32} className="object-contain h-8 w-8" />
                      <span className="text-xs font-medium">{provider.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn("pl-8", errors.amount && "border-red-500")}
                />
              </div>
              {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
            </div>

            {/* UPI ID Input */}
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID *</Label>
              <div className="relative">
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={cn(errors.upiId && "border-red-500")}
                />
                {upiId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={copyUPIId}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {errors.upiId && <p className="text-sm text-red-600">{errors.upiId}</p>}
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select defaultValue={paymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary Payment</SelectItem>
                  <SelectItem value="course_fee">Course Fee</SelectItem>
                  <SelectItem value="bonus">Bonus Payment</SelectItem>
                  <SelectItem value="reimbursement">Reimbursement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Payment description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(errors.description && "border-red-500")}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* QR Code Option */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 space-x-3">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Pay with QR Code</p>
                  <p className="text-sm text-muted-foreground">Scan QR code with any UPI app</p>
                </div>
              </div>
              <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Show QR
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">₹{amount}</p>
                      <p className="text-sm text-muted-foreground">to {teacherName}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Amount</span>
            <span className="font-medium">₹{amount || "0.00"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Processing Fee</span>
            <span className="font-medium text-green-600">FREE</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span>₹{amount || "0.00"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <div className="space-y-4">
        <Button
          onClick={handlePayment}
          className="w-full h-12 sm:h-14 text-lg sm:text-xl"
          disabled={!amount || Number.parseFloat(amount) <= 0}
        >
          Pay ₹{amount || "0.00"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send ₹{amount} to {teacherName} via UPI. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <span>Recipient:</span>
              <span className="font-medium">{teacherName}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span>UPI ID:</span>
              <span className="font-medium">{upiId}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span>Amount:</span>
              <span className="font-medium">₹{amount}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span>Description:</span>
              <span className="font-medium">{description}</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPayment}>Confirm Payment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
