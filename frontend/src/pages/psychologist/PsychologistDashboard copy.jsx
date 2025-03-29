import { AppSidebar } from '@/components/admin/AppSidebar'
import PsychologistSidebar from '@/components/psychologist/PsychologistSidebar'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, DollarSign, KeyRound, LineChart, User,CheckCircle,CircleCheckBig } from 'lucide-react'

const PsychologistDashboard = () => {
  

  return (
    <div>
     
      <div className="flex flex-col">
            <header className="flex h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-muted/40 px-6">

              <h1 className="font-semibold text-lg">Dashboard</h1>
            
            </header>
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-8 ">
              <div className="flex items-end gap-2 justify-end mb-4 text-xl font-extrabold text-green-500">
                <h2>Account verified</h2>
                <CircleCheckBig className="w-5 h-5 my-auto" />
               </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">245</div>
                      <p className="text-xs text-muted-foreground">+4% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">For the next 7 days</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,450</div>
                      <p className="text-xs text-muted-foreground">+10% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.8/5</div>
                      <p className="text-xs text-muted-foreground">Based on 120 reviews</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest consultations and patient interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                 
                      <p>Recent activity content goes here...</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main> 
          </div>
      
      
    </div>
  )
}

export default PsychologistDashboard
