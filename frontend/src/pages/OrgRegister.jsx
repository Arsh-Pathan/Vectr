import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import api from '../config/api';
import toast from 'react-hot-toast';

export default function OrgRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    github_org_url: '',
    contact_email: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await api.post('/org/register', formData);
      toast.success('Organization registered successfully! Ingestion started.');
      // Typically we'd navigate to an org dashboard, but we'll go to dashboard for now
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error('Failed to register organization. Please check the URL and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Register Your Organization</h1>
          <p className="text-text-secondary text-lg">
            Connect your open-source organization to Vectr and let our AI match your issues with the right contributors.
          </p>
        </div>

        <Card className="p-8 shadow-sm" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acme Open Source"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue outline-none transition-shadow"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub Organization URL</label>
              <input
                type="url"
                name="github_org_url"
                required
                value={formData.github_org_url}
                onChange={handleChange}
                placeholder="https://github.com/acme-org"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue outline-none transition-shadow"
              />
              <p className="text-xs text-gray-500 mt-2">We will automatically scan and index open issues from your public repositories.</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                required
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="admin@acme.org"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue outline-none transition-shadow"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell contributors what your organization is all about..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue outline-none transition-shadow"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
                {isSubmitting ? 'Registering & Scanning...' : 'Register Organization'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
