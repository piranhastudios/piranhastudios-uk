"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: ''
  })
  type Errors = {
    name?: string
    email?: string
    budget?: string
    message?: string
  }
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null) // 'success' | 'error'

  const validateForm = () => {
    const newErrors: Errors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us about your project'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide more details about your project (at least 10 characters)'
    }

    return Object.keys(newErrors).length === 0 ? true : (setErrors(newErrors), false)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof Errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('https://hooks.zapier.com/hooks/catch/18437871/uo5gym9/', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          budget: formData.budget.trim() || 'Not specified',
          message: formData.message.trim(),
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', budget: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          Let's Build Something Great
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
              <h3 className="text-2xl font-semibold text-[#e5e7eb] mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-[#fca5a5] mr-3" />
                  <span className="text-[#9ca3af]">info@piranhastudios.co.uk</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-[#fca5a5] mr-3" />
                  <span className="text-[#9ca3af]">Book a call for immediate response</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-[#e5e7eb] mb-4">Quick Start</h3>
              <p className="text-[#9ca3af] mb-6">
                Ready to get started? Book your £50 evaluation call and let's discuss your project.
              </p>
              <Button className="w-full bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-xl">
                Book Evaluation Call
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
            <h3 className="text-2xl font-semibold text-[#e5e7eb] mb-6">Send a Message</h3>
            
            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-green-300">Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <span className="text-red-300">Failed to send message. Please try again or contact us directly.</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5] ${
                    errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5] ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Project Budget (Optional)"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5]"
                />
              </div>

              <div>
                <Textarea
                  placeholder="Tell me about your project..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5] resize-none ${
                    errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#fca5a5] hover:bg-[#f87171] text-[#091113] font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}