import { Link } from "wouter";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      {/* Hero section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-poppins text-3xl md:text-4xl font-semibold leading-tight mb-6">
              Cherish memories and find <span className="text-[hsl(var(--lavender))]">comfort</span> in connection
            </h2>
            <p className="text-lg mb-8 text-neutral-dark/80 leading-relaxed">
              Create a digital avatar of your loved one from a photo and engage in meaningful conversations. A gentle way to process grief and hold onto special memories.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/create">
                <a className="px-8 py-3 gradient-bg text-white rounded-full font-medium shadow-soft hover:shadow-medium transition-all">
                  Create a Memory Companion
                </a>
              </Link>
              <a href="#learn" className="px-8 py-3 border border-[hsl(var(--lavender))] text-[hsl(var(--lavender))] rounded-full font-medium hover:bg-[hsl(var(--lavender)/5)] transition-all">
                Learn More
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-[hsl(var(--lavender)/30)] to-[hsl(var(--teal)/30)] rounded-2xl overflow-hidden shadow-medium animate-float">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80" 
                alt="People looking at photos together" 
                className="w-full h-full object-cover mix-blend-overlay opacity-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--lavender)/40)] via-transparent to-[hsl(var(--teal)/30)]"></div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-[hsl(var(--blue)/30)] to-[hsl(var(--green)/30)] rounded-full blur-2xl -z-10"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-[hsl(var(--lavender)/30)] to-[hsl(var(--teal)/30)] rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mb-20" id="learn">
        <h2 className="font-poppins text-2xl md:text-3xl font-semibold text-center mb-12 text-gradient">How Memoria Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-soft flex flex-col items-center text-center transform transition-all hover:scale-105 hover:shadow-medium">
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--lavender)/15)] flex items-center justify-center mb-6">
              <i className="fa-solid fa-image text-[hsl(var(--lavender))] text-xl"></i>
            </div>
            <h3 className="font-poppins font-medium text-xl mb-4">Photo Transformation</h3>
            <p className="text-neutral-dark/80">Upload a favorite photo and our AI technology will transform it into a realistic, responsive avatar.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-soft flex flex-col items-center text-center transform transition-all hover:scale-105 hover:shadow-medium">
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--teal)/15)] flex items-center justify-center mb-6">
              <i className="fa-solid fa-comments text-[hsl(var(--teal))] text-xl"></i>
            </div>
            <h3 className="font-poppins font-medium text-xl mb-4">Meaningful Conversations</h3>
            <p className="text-neutral-dark/80">Exchange messages with your memory companion, who will respond in a manner reminiscent of your loved one.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-soft flex flex-col items-center text-center transform transition-all hover:scale-105 hover:shadow-medium">
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--blue)/15)] flex items-center justify-center mb-6">
              <i className="fa-solid fa-headphones text-[hsl(var(--blue))] text-xl"></i>
            </div>
            <h3 className="font-poppins font-medium text-xl mb-4">Voice Connection</h3>
            <p className="text-neutral-dark/80">Hear responses in a voice that feels familiar, offering a deeper sense of connection and comfort.</p>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="mb-20">
        <h2 className="font-poppins text-2xl md:text-3xl font-semibold text-center mb-4 text-gradient">Personal Journeys</h2>
        <p className="text-center text-neutral-dark/80 max-w-2xl mx-auto mb-12">How Memoria has helped others find comfort and connection during difficult times.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[hsl(var(--lavender)/10)] to-[hsl(var(--teal)/10)] p-8 rounded-xl shadow-medium hover:shadow-lg transition-all">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[hsl(var(--lavender)/30)]">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80" 
                  alt="Woman with long dark hair" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-medium text-lg">Sarah J.</h3>
                <p className="text-neutral-medium text-sm">Lost her father in 2021</p>
              </div>
            </div>
            <p className="italic text-neutral-dark/80 leading-relaxed">
              "Being able to see and hear my dad's avatar helped me process my grief in a way I never thought possible. It's not about replacing him, but about having a space to remember and connect."
            </p>
          </div>

          <div className="bg-gradient-to-br from-[hsl(var(--lavender)/10)] to-[hsl(var(--teal)/10)] p-8 rounded-xl shadow-medium hover:shadow-lg transition-all">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[hsl(var(--teal)/30)]">
                <img 
                  src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80" 
                  alt="Man with short brown hair" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-medium text-lg">Michael T.</h3>
                <p className="text-neutral-medium text-sm">Lost his grandmother in 2022</p>
              </div>
            </div>
            <p className="italic text-neutral-dark/80 leading-relaxed">
              "I was skeptical at first, but creating a memory companion of my grandmother has been therapeutic. I can share thoughts with her that I never got to express when she was alive."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
