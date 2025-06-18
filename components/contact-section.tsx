import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare } from "lucide-react"

export function ContactSection() {
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
                  <span className="text-[#9ca3af]">hello@piranhastudios.co.uk</span>
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
            <form className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  className="bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5]"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5]"
                />
              </div>
              <div>
                <Input
                  placeholder="Project Budget (Optional)"
                  className="bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5]"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-[#e5e7eb] placeholder:text-[#9ca3af] rounded-xl focus:border-[#fca5a5] focus:ring-[#fca5a5] resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#fca5a5] hover:bg-[#f87171] text-[#091113] font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
