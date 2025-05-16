'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image 
                src="/images/logo.png" 
                alt="EdPsychConnect Logo" 
                width={40} 
                height={40} 
                className="mr-2"
              />
              <span className="text-xl font-bold text-gray-900">EdPsychConnect</span>
            </div>
            <p className="text-gray-600 mb-4">
              Connecting educational psychologists, educators, and students through AI-powered tools and resources.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:info@edpsychconnect.com" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/assessments" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Assessments
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/ai-lab" className="text-gray-600 hover:text-primary-600 transition-colors">
                  AI Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} EdPsychConnect. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}