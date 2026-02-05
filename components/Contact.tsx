
import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mojnadjr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="min-h-screen px-8 md:px-24 py-24 bg-[#0f1115] flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
            I'll try my best to get back to you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b22] p-12 rounded-3xl border border-gray-800 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-medium">Name</label>
              <input 
                type="text" 
                placeholder="Arpit Yadav"
                className="w-full bg-[#0a0c10] border border-gray-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#ffbd12] transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-medium">Email</label>
              <input 
                type="email" 
                placeholder="arpit@example.com"
                className="w-full bg-[#0a0c10] border border-gray-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#ffbd12] transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium">Message</label>
            <textarea 
              rows={5}
              placeholder="Hi Arpit Yadav, I'd like to talk about..."
              className="w-full bg-[#0a0c10] border border-gray-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#ffbd12] transition-colors resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-[#ffbd12] text-[#0f1115] py-5 rounded-xl font-bold text-lg hover:bg-[#e5a910] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-[#ffbd121a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Failed. Try Again' : 'Send Message'}
          </button>
          
          {status === 'success' && (
            <p className="text-green-500 text-center text-sm">Message sent successfully! I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-center text-sm">Failed to send message. Please try again or email me directly at arpiteducation2004@gmail.com</p>
          )}
        </form>
      </div>

      <footer className="mt-20 pt-10 border-t border-gray-900 text-center space-y-4">
        <p className="text-gray-600 font-mono text-sm">
          Designed & Built by Arpit Yadav © 2026
        </p>
      </footer>
    </section>
  );
};
