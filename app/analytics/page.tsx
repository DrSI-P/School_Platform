'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart2, PieChart, LineChart, TrendingUp, Users, Clock, Download, Filter } from 'lucide-react'

export default function AnalyticsPage() {
  // Sample analytics categories
  const analyticsCategories = [
    { id: 1, name: 'Student Performance', icon: TrendingUp },
    { id: 2, name: 'Learning Patterns', icon: LineChart },
    { id: 3, name: 'Assessment Results', icon: BarChart2 },
    { id: 4, name: 'Engagement Metrics', icon: Users },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-gray-600 text-lg">
          Track progress and identify patterns with detailed learning analytics and visualizations
        </p>
      </div>

      {/* Dashboard Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="p-2 border rounded-md w-full sm:w-48">
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Group</label>
              <select className="p-2 border rounded-md w-full sm:w-48">
                <option value="all">All Students</option>
                <option value="grade5">Grade 5</option>
                <option value="grade6">Grade 6</option>
                <option value="grade7">Grade 7</option>
                <option value="grade8">Grade 8</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Clock className="h-4 w-4 mr-2" />
              Update Now
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Performance</p>
                <h3 className="text-3xl font-bold">78%</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last period
                </p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <BarChart2 className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completion Rate</p>
                <h3 className="text-3xl font-bold">92%</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% from last period
                </p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <PieChart className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Engagement Score</p>
                <h3 className="text-3xl font-bold">84%</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +7% from last period
                </p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Learning Time</p>
                <h3 className="text-3xl font-bold">24h</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2h from last period
                </p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Dashboard */}
      <div className="mb-12">
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Subject</CardTitle>
                  <CardDescription>
                    Average performance scores across different subject areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center p-4">
                      <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Bar chart visualization placeholder</p>
                      <p className="text-sm text-gray-400 mt-2">Shows performance metrics by subject</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    Performance trends over the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center p-4">
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Line chart visualization placeholder</p>
                      <p className="text-sm text-gray-400 mt-2">Shows performance trends over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Engagement" tab to view engagement analytics.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="assessments">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Assessments" tab to view assessment analytics.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Progress" tab to view progress analytics.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Analytics Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Analytics Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {analyticsCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                {React.createElement(category.icon, { className: "h-6 w-6 text-primary-600" })}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">
                Detailed analytics and insights for {category.name.toLowerCase()}
              </p>
              <Link href={`/analytics/${category.name.toLowerCase().replace(' ', '-')}`} className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-primary-50 p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold mb-4">AI-Powered Learning Insights</h2>
            <p className="text-gray-700 mb-4">
              Our AI analyzes learning data to provide personalized insights and recommendations for improving educational outcomes.
            </p>
            <Button>Generate Insights Report</Button>
          </div>
          <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Sample Insights:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Students show higher engagement with interactive content</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Math performance improves with visual learning aids</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Reading comprehension correlates with vocabulary exercises</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}