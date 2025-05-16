'use client'

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MessageSquare, Search, BookOpen, Award, UserPlus, Heart, Share2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community | EdPsychConnect',
  description: 'Connect with educators, specialists, and students in our educational community',
}

export default function CommunityPage() {
  // Sample community categories
  const communityCategories = [
    { id: 1, name: 'Educators', count: 1250, icon: Users },
    { id: 2, name: 'Discussions', count: 348, icon: MessageSquare },
    { id: 3, name: 'Resources', count: 520, icon: BookOpen },
    { id: 4, name: 'Events', count: 42, icon: Award },
  ]

  // Sample trending discussions
  const trendingDiscussions = [
    {
      id: 1,
      title: 'Integrating AI tools in elementary classrooms',
      author: 'Maria Johnson',
      authorRole: 'Elementary Teacher',
      replies: 28,
      likes: 45,
      lastActivity: '2 hours ago',
      tags: ['AI in Education', 'Elementary', 'Teaching Strategies'],
    },
    {
      id: 2,
      title: 'Best practices for supporting students with ADHD',
      author: 'Dr. Robert Chen',
      authorRole: 'Educational Psychologist',
      replies: 34,
      likes: 62,
      lastActivity: '5 hours ago',
      tags: ['ADHD', 'Support Strategies', 'Inclusive Education'],
    },
    {
      id: 3,
      title: 'Using data analytics to personalize learning experiences',
      author: 'Sarah Williams',
      authorRole: 'Curriculum Developer',
      replies: 19,
      likes: 37,
      lastActivity: '1 day ago',
      tags: ['Data Analytics', 'Personalized Learning', 'EdTech'],
    },
  ]

  // Sample featured members
  const featuredMembers = [
    {
      id: 1,
      name: 'Dr. Emily Parker',
      role: 'Educational Psychologist',
      contributions: 87,
      joined: 'March 2025',
      avatar: '/images/community/avatar1.png',
    },
    {
      id: 2,
      name: 'Michael Thompson',
      role: 'High School Teacher',
      contributions: 64,
      joined: 'January 2025',
      avatar: '/images/community/avatar2.png',
    },
    {
      id: 3,
      name: 'Dr. Lisa Rodriguez',
      role: 'Researcher',
      contributions: 112,
      joined: 'November 2024',
      avatar: '/images/community/avatar3.png',
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'EdTech Specialist',
      contributions: 53,
      joined: 'February 2025',
      avatar: '/images/community/avatar4.png',
    },
  ]

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'AI in Education Webinar',
      date: 'May 25, 2025',
      time: '3:00 PM - 4:30 PM EST',
      attendees: 156,
      type: 'Online',
    },
    {
      id: 2,
      title: 'Educational Psychology Conference',
      date: 'June 10-12, 2025',
      time: 'All Day',
      attendees: 320,
      type: 'In-Person',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Educational Community</h1>
        <p className="text-gray-600 text-lg">
          Connect with other educators, specialists, and students to share ideas and collaborate
        </p>
      </div>

      {/* Community Search and Join */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search discussions, resources, or members..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Find Connections
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          </div>
        </div>
      </div>

      {/* Community Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Explore Community</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {communityCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                {React.createElement(category.icon, { className: "h-6 w-6 text-primary-600" })}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">
                {category.count} {category.name.toLowerCase()}
              </p>
              <Link href={`/community/${category.name.toLowerCase()}`} className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                Explore {category.name}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Discussions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trending Discussions</h2>
        <div className="space-y-4">
          {trendingDiscussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="mb-4 md:mb-0 md:pr-6">
                    <Link href={`/community/discussions/${discussion.id}`} className="text-xl font-semibold hover:text-primary-600 transition-colors">
                      {discussion.title}
                    </Link>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span className="mr-4">By: {discussion.author}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{discussion.authorRole}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {discussion.tags.map((tag, index) => (
                        <span key={index} className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end space-x-4 md:space-x-0 md:space-y-2">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{discussion.replies} replies</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{discussion.likes} likes</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Last activity: {discussion.lastActivity}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="text-center mt-6">
            <Button variant="outline">View All Discussions</Button>
          </div>
        </div>
      </div>

      {/* Featured Members */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Community Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featuredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4 relative">
                  {/* Placeholder for member avatar */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                    Avatar
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{member.role}</p>
                <div className="text-xs text-gray-500 mb-4">
                  <p>Joined: {member.joined}</p>
                  <p>{member.contributions} contributions</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="discussions">Latest Discussions</TabsTrigger>
            <TabsTrigger value="resources">Shared Resources</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="groups">Community Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Latest Discussions" tab to view recent community discussions.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Shared Resources" tab to view resources shared by community members.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 mb-2">
                          <span className="mr-4">{event.date}</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded mr-3 ${
                            event.type === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {event.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            <Users className="h-4 w-4 inline mr-1" />
                            {event.attendees} attending
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button size="sm">Register</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="groups">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Switch to the "Community Groups" tab to view and join community groups.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Join Community */}
      <div className="bg-primary-50 p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold mb-4">Join Our Educational Community</h2>
            <p className="text-gray-700 mb-4">
              Connect with educators, specialists, and students from around the world. Share ideas, collaborate on projects, and enhance your educational practice.
            </p>
            <div className="flex space-x-3">
              <Button>Create Account</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Community Benefits:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Connect with like-minded professionals</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Share and access educational resources</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Participate in discussions and events</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Collaborate on educational projects</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}