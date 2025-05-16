'use client'

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, BarChart2, Clock, Users, PlusCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Assessments | EdPsychConnect',
  description: 'Create and manage educational assessments with AI-powered analysis',
}

export default function AssessmentsPage() {
  // Sample assessment types
  const assessmentTypes = [
    { id: 1, name: 'Formative', description: 'Ongoing assessments to monitor learning progress', icon: Clock },
    { id: 2, name: 'Summative', description: 'End-of-unit assessments to evaluate learning outcomes', icon: FileText },
    { id: 3, name: 'Diagnostic', description: 'Pre-assessments to identify learning needs', icon: BarChart2 },
    { id: 4, name: 'Peer', description: 'Student-to-student assessment activities', icon: Users },
  ]

  // Sample recent assessments
  const recentAssessments = [
    {
      id: 1,
      title: 'Reading Comprehension Assessment',
      type: 'Formative',
      subject: 'English',
      gradeLevel: 'Grade 5',
      lastModified: '2 days ago',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Mathematical Problem Solving',
      type: 'Summative',
      subject: 'Mathematics',
      gradeLevel: 'Grade 7',
      lastModified: '1 week ago',
      status: 'Draft',
    },
    {
      id: 3,
      title: 'Scientific Inquiry Skills',
      type: 'Diagnostic',
      subject: 'Science',
      gradeLevel: 'Grade 6',
      lastModified: '3 days ago',
      status: 'Active',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-gray-600 text-lg">
          Create, manage, and analyze educational assessments with AI-powered insights
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Create New Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Design a new assessment from scratch or use templates
            </p>
            <Button className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Import Existing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Import assessments from external files or systems
            </p>
            <Button variant="outline" className="w-full">
              Import Assessment
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assessment Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Browse and use pre-designed assessment templates
            </p>
            <Button variant="outline" className="w-full">
              View Templates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Assessment Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {assessmentTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                {React.createElement(type.icon, { className: "h-6 w-6 text-primary-600" })}
              </div>
              <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
              <p className="text-gray-600 text-sm">{type.description}</p>
              <Link href={`/assessments/create?type=${type.name.toLowerCase()}`} className="mt-4 text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                Create {type.name} Assessment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* My Assessments */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Assessments</h2>
        
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4">
            {recentAssessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{assessment.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{assessment.type}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{assessment.subject}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{assessment.gradeLevel}</span>
                      </div>
                      <p className="text-sm text-gray-500">Last modified: {assessment.lastModified}</p>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                      <span className={`text-sm px-2 py-1 rounded mr-4 ${
                        assessment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assessment.status}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Results</Button>
                        <Button size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="active">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Active" tab to view your active assessments.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="drafts">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Drafts" tab to view your draft assessments.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="archived">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Archived" tab to view your archived assessments.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI-Powered Analysis */}
      <div className="bg-primary-50 p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold mb-4">AI-Powered Assessment Analysis</h2>
            <p className="text-gray-700 mb-4">
              Our AI tools can analyze assessment results to provide insights into student performance, identify learning gaps, and suggest personalized interventions.
            </p>
            <Button>Learn More</Button>
          </div>
          <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Analysis Features:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Performance trends</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Learning gap identification</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Personalized feedback</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Intervention recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}