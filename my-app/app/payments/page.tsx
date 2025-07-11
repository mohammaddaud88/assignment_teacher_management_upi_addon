"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UPIPayment } from "@/components/upi-payment"
import { PaymentHistoryComponent } from "@/components/payment-history"
import { CreditCard, Plus, TrendingUp, Users, DollarSign } from "lucide-react"
import type { PaymentResponse } from "@/lib/payment-types"

export default function PaymentsPage() {
  const [showNewPayment, setShowNewPayment] = useState(false)

  const handlePaymentComplete = (response: PaymentResponse) => {
    console.log("Payment completed:", response)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-muted-foreground">Manage teacher payments and view transaction history</p>
      </div>


      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">₹45,230</p>
                <p className="text-xs text-muted-foreground">Total Paid This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Teachers Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="new-payment" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="new-payment">New Payment</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex justify-center sm:justify-end w-full sm:w-auto">
            <Button onClick={() => setShowNewPayment(true)} size="sm">
              <Plus className="h-3 w-3 mr-2" />
              Quick Pay
            </Button>
          </div>
        </div>


        <TabsContent value="new-payment" className="space-y-4">
          <UPIPayment
            teacherName="Mr. Suraj"
            defaultAmount={5000}
            paymentType="salary"
            onPaymentComplete={handlePaymentComplete}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PaymentHistoryComponent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
