'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { BrainCircuit, Code, Rocket, Users, BarChart2, Shield, Database, Sparkles } from 'lucide-react'

export default function Home() {
  const [showMore, setShowMore] = useState(false)
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Connecting Educational Psychology with Modern Learning</h2>
              <p className="text-xl mb-8">
                EdPsychConnect bridges the gap between educational psychology and classroom practice with AI-powered tools and resources.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-colors text-center">
                  Get Started
                </Link>
                <Link href="/demo" className="bg-transparent border-2 border-white hover:bg-white/10 font-medium py-3 px-6 rounded-md transition-colors text-center">
                  Request Demo
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="rounded-lg h-80 w-full overflow-hidden">
                <Image
                  src="/images/hero-image.png"
                  alt="EdPsychConnect Platform Preview"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers a comprehensive suite of tools designed to enhance educational outcomes through evidence-based approaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - AI Lab */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mr-4">
                  <BrainCircuit className="h-6 w-6 text-primary-600" />
                </div>
                <div className="w-12 h-12">
                  <Image
                    src="/images/ai-lab-icon.png"
                    alt="AI Lab"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Lab</h3>
              <p className="text-gray-600 mb-4">
                Build and experiment with AI tools for education in our interactive coding environment.
              </p>
              <Link href="/ai-lab" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                Explore AI Lab
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Feature 2 - Collaborative Projects */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mr-4">
                  <Rocket className="h-6 w-6 text-primary-600" />
                </div>
                <div className="w-12 h-12">
                  <Image
                    src="/images/projects-icon.png"
                    alt="Collaborative Projects"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Projects</h3>
              <p className="text-gray-600 mb-4">
                Work together on AI-powered educational tools and resources with team members.
              </p>
              <Link href="/projects" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                View Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Feature 3 - AI-Powered Resources */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mr-4">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                </div>
                <div className="w-12 h-12">
                  <Image
                    src="/images/resources-icon.png"
                    alt="AI-Powered Resources"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Resources</h3>
              <p className="text-gray-600 mb-4">
                Generate personalized educational materials tailored to individual learning profiles and needs.
              </p>
              <Link href="/resources" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                Browse Resources
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          {showMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {/* Feature 4 - Advanced Analytics */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learning Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Track progress and identify patterns with detailed learning analytics and visualizations.
                </p>
                <Link href="/analytics" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                  View Analytics
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Feature 5 - FERPA & COPPA Compliant */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">FERPA & COPPA Compliant</h3>
                <p className="text-gray-600 mb-4">
                  Built with privacy and security at its core, ensuring all educational data is protected.
                </p>
                <Link href="/compliance" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Feature 6 - Community */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Educational Community</h3>
                <p className="text-gray-600 mb-4">
                  Connect with other educators, specialists, and students to share ideas and collaborate.
                </p>
                <Link href="/community" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                  Join Community
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
          
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowMore(!showMore)} 
              className="bg-white text-primary-600 hover:bg-gray-50 border border-primary-600 font-medium py-2 px-6 rounded-md transition-colors"
            >
              {showMore ? 'Show Less' : 'Show More Features'}
            </button>
          </div>
        </div>
      </section>

      {/* AI Lab Showcase Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Lab: Build Your Own Educational Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI Lab provides a safe environment for students to experiment with AI and build tools that enhance their learning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gray-800 p-3 text-white text-sm font-mono">
                AI Lab - Code Editor
              </div>
              <div className="relative">
                <Image
                  src="/images/ai-lab-showcase.png"
                  alt="AI Lab Code Editor"
                  width={600}
                  height={400}
                  className="object-cover w-full"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-70 p-4 font-mono text-green-400 text-sm whitespace-pre overflow-x-auto">
{`// Example AI-powered learning tool
function analyzeText(text) {
  // Use AI to analyze sentiment and key concepts
  return {
    sentiment: "positive",
    keywords: ["learning", "AI", "education"],
    readabilityScore: 85,
    suggestions: [
      "Consider adding more examples",
      "Explain the concept in simpler terms"
    ]
  };
}

// Example usage
const feedback = analyzeText(studentEssay);
console.log(feedback);`}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">What You Can Build</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">
                    <span className="font-medium text-gray-900">Personalized Learning Tools</span> - Create AI assistants that adapt to individual learning styles
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">
                    <span className="font-medium text-gray-900">Automated Feedback Systems</span> - Develop tools that provide instant, constructive feedback on assignments
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">
                    <span className="font-medium text-gray-900">Content Generators</span> - Build tools that create customized learning materials based on curriculum needs
                  </p>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/ai-lab" className="bg-primary-600 text-white hover:bg-primary-700 font-medium py-3 px-6 rounded-md transition-colors inline-block">
                  Try AI Lab Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Educational Outcomes?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of educational professionals already using EdPsychConnect to enhance learning experiences.
            </p>
            <Link href="/auth/signup" className="bg-primary-600 text-white hover:bg-primary-700 font-medium py-3 px-8 rounded-md transition-colors inline-block text-lg">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EdPsychConnect</h3>
              <p className="text-gray-300">
                Bridging the gap between educational psychology and classroom practice.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/compliance" className="text-gray-300 hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EdPsychConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}