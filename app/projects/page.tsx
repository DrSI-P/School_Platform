'use client'

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Rocket, Users, Calendar, Clock, PlusCircle, Star, GitBranch } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Projects | EdPsychConnect',
  description: 'Collaborate on AI-powered educational projects',
}

export default function ProjectsPage() {
  // Sample project categories
  const projectCategories = [
    { id: 1, name: 'AI Learning Tools', count: 12 },
    { id: 2, name: 'Curriculum Development', count: 8 },
    { id: 3, name: 'Assessment Projects', count: 15 },
    { id: 4, name: 'Research Initiatives', count: 6 },
  ]

  // Sample active projects
  const activeProjects = [
    {
      id: 1,
      title: 'Personalized Reading Assistant',
      description: 'An AI tool that adapts reading materials to individual student reading levels and interests.',
      category: 'AI Learning Tools',
      members: 4,
      progress: 65,
      dueDate: 'June 15, 2025',
    },
    {
      id: 2,
      title: 'Math Concept Visualization',
      description: 'Interactive visualizations for abstract mathematical concepts to enhance understanding.',
      category: 'Curriculum Development',
      members: 3,
      progress: 40,
      dueDate: 'July 10, 2025',
    },
    {
      id: 3,
      title: 'Behavioral Assessment Framework',
      description: 'A comprehensive framework for assessing and tracking behavioral development in students.',
      category: 'Assessment Projects',
      members: 5,
      progress: 80,
      dueDate: 'May 30, 2025',
    },
  ]

  // Sample featured project
  const featuredProject = {
    id: 4,
    title: 'Adaptive Learning Pathway Generator',
    description: 'An AI-powered system that creates personalized learning pathways based on student performance, interests, and learning style.',
    category: 'AI Learning Tools',
    members: 7,
    progress: 75,
    dueDate: 'June 5, 2025',
    highlights: [
      'Integrates with existing curriculum standards',
      'Provides real-time adaptation based on performance',
      'Includes visualization of learning progress',
      'Supports multiple learning modalities',
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Collaborative Projects</h1>
        <p className="text-gray-600 text-lg">
          Work together on AI-powered educational tools and resources
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Find Collaborators
        </Button>
        <Button variant="outline">
          <Star className="h-4 w-4 mr-2" />
          Browse Featured Projects
        </Button>
      </div>

      {/* Featured Project */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Project</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="md:flex">
            <div className="md:w-2/3 p-6">
              <div className="flex items-center mb-4">
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mr-2">
                  {featuredProject.category}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{featuredProject.title}</h3>
              <p className="text-gray-600 mb-4">{featuredProject.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{featuredProject.members} team members</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Due: {featuredProject.dueDate}</span>
                </div>
                <div className="flex items-center">
                  <GitBranch className="h-5 w-5 text-gray-500 mr-2" />
                  <span>12 contributions this week</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Updated 2 days ago</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button>View Project</Button>
                <Button variant="outline">Join Team</Button>
              </div>
            </div>
            
            <div className="md:w-1/3 bg-gray-50 p-6 border-l border-gray-200">
              <h4 className="font-semibold mb-4">Project Highlights</h4>
              <ul className="space-y-2">
                {featuredProject.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${featuredProject.progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {featuredProject.progress}% complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Projects */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Projects</h2>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mr-2">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{project.members} members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due: {project.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {project.progress}% complete
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button size="sm">Open</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Completed" tab to view your completed projects.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="drafts">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Drafts" tab to view your draft projects.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="archived">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Archived" tab to view your archived projects.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Project Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {projectCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.count} projects</p>
              <Link href={`/projects/category/${category.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                Browse Projects
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Collaboration Tools */}
      <div className="bg-primary-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Collaboration Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Editing</CardTitle>
              <CardDescription>
                Collaborate on documents and code in real-time with team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Our real-time editing tools allow multiple team members to work on the same document simultaneously, with changes visible instantly.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Track tasks, milestones, and progress with integrated tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Manage your project workflow with task assignments, progress tracking, and milestone management tools.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>
                Keep track of changes and maintain version history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Our version control system tracks all changes, allowing you to review history, compare versions, and revert to previous states if needed.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}