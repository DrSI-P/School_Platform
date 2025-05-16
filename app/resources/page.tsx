'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText, Download, Star } from 'lucide-react'

export default function ResourcesPage() {
  // Sample resource categories
  const categories = [
    { id: 1, name: 'Lesson Plans', icon: FileText, count: 24 },
    { id: 2, name: 'Worksheets', icon: Download, count: 36 },
    { id: 3, name: 'Reading Materials', icon: BookOpen, count: 18 },
    { id: 4, name: 'Assessment Tools', icon: Star, count: 12 },
  ]

  // Sample featured resources
  const featuredResources = [
    {
      id: 1,
      title: 'Cognitive Development Framework',
      description: 'A comprehensive guide to understanding cognitive development stages in children aged 5-12.',
      category: 'Framework',
      imageUrl: '/images/resources/cognitive-dev.png',
    },
    {
      id: 2,
      title: 'Emotional Intelligence Worksheet',
      description: 'Interactive worksheet to help students identify and understand different emotions.',
      category: 'Worksheet',
      imageUrl: '/images/resources/emotional-intelligence.png',
    },
    {
      id: 3,
      title: 'Learning Styles Assessment',
      description: 'Tool to help identify individual learning styles and preferences.',
      category: 'Assessment',
      imageUrl: '/images/resources/learning-styles.png',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Educational Resources</h1>
        <p className="text-gray-600 text-lg">
          Access AI-powered educational resources tailored to individual learning needs
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <select className="p-2 border rounded-md">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name.toLowerCase()}>
                  {category.name}
                </option>
              ))}
            </select>
            <select className="p-2 border rounded-md">
              <option value="">All Grade Levels</option>
              <option value="elementary">Elementary</option>
              <option value="middle">Middle School</option>
              <option value="high">High School</option>
            </select>
            <Button>Search</Button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="rounded-full bg-primary-100 p-4 mb-4">
                {React.createElement(category.icon, { className: "h-8 w-8 text-primary-600" })}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.count} resources</p>
              <Link href={`/resources/category/${category.name.toLowerCase()}`} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
                Browse {category.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 w-full relative bg-gray-200">
                {/* Placeholder for resource image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Resource Image Placeholder
                </div>
              </div>
              <CardHeader>
                <div className="text-sm text-primary-600 font-medium mb-1">{resource.category}</div>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">View Resource</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Custom Resources */}
      <div className="bg-primary-50 p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold mb-4">Create Custom Resources</h2>
            <p className="text-gray-700 mb-4">
              Use our AI-powered tools to create personalized educational resources tailored to your specific needs and learning objectives.
            </p>
            <Button>Create New Resource</Button>
          </div>
          <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">What you can create:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Custom worksheets</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Lesson plans</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Assessment materials</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-600 mr-2"></div>
                <span>Visual learning aids</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}