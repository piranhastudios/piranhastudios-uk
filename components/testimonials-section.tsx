const testimonials = [
  {
    quote: "My time is my own again — our systems run smoother than ever.",
    name: "Dr Adeline Afong",
    title: "Founder, Skeendeep",
  },
  {
    quote: "The things this team make are amazing!",
    name: "Eddy Ankrett",
    title: "Chairman of the Dating Agency Association",
  },
  {
    quote: "Jake understood our vision immediately and working with him exactly what we needed.",
    name: "Joel Blake (OBE)",
    title: "Founder, GFA Exchange",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#e5e7eb] to-[#9ca3af] bg-clip-text text-transparent">
          What Founders Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg hover:shadow-[#fca5a5]/20 transition-all duration-500 hover:scale-105 hover:bg-white/10"
            >
              <div className="mb-6">
                <div className="text-4xl text-[#fca5a5] mb-4">"</div>
                <p className="text-[#e5e7eb] text-lg leading-relaxed">{testimonial.quote}</p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="font-semibold text-[#e5e7eb]">{testimonial.name}</p>
                <p className="text-[#9ca3af]">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
