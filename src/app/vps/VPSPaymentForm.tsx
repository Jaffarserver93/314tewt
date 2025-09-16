'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { ArrowLeft, User, Mail, MessageCircle, Send, CheckCircle, Server, ExternalLink, Key, Copy } from 'lucide-react';
import { createOrderAction } from '@/app/actions';
import type { VpsPlan } from '@/lib/types';
import type { Order } from '@/lib/database';

interface VPSPaymentFormProps {
  selectedPlan: VpsPlan;
  onBack: () => void;
}

const VPSPaymentForm: React.FC<VPSPaymentFormProps> = ({ selectedPlan, onBack }) => {
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
    email: session?.user?.email || '',
    discordUsername: (session?.user as any)?.username || '',
    serverPurpose: ''
  });

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  useEffect(() => {
    // Generate a random password when the component mounts
    const generatePassword = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      let newPassword = '';
      for (let i = 0; i < 14; i++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return newPassword;
    };
    setPassword(generatePassword());
  }, []);

  const copyToClipboard = (text: string, type: 'order' | 'password') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if ((name === 'discordUsername' || name === 'email') && status === 'authenticated') {
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          input: 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900/20',
          card: 'bg-white/10 backdrop-blur-md border-white/20',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          button: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
          input: 'bg-white/10 border-white/20 text-white placeholder-gray-400'
        };
    }
  };
  
  const themeStyles = getThemeClasses();

  const getPlanIcon = (plan: VpsPlan) => {
    return <Server className="w-5 h-5 text-white" />;
  };

  const sendToDiscord = async (generatedOrderId: string, vpsPassword: string) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1393999338329604126/zo9VrQY1cyoLp4ZgLpf8BytjQKF_nH6rYgZHAVDhF8L2IIOod2fdbWv04ds072olZ6Wl';

    const embed = {
        title: "🖥️ New VPS Hosting Order!",
        color: 0x3b82f6,
        fields: [
          {
            name: "🆔 Order ID",
            value: `**${generatedOrderId}**`,
            inline: false
          },
          {
            name: "👤 Customer Information",
            value: `**Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Discord:** ${formData.discordUsername}`,
            inline: false
          },
          {
            name: "🔐 Credentials",
            value: `**Password:** ||${vpsPassword}||`,
            inline: false,
          },
          {
            name: "🖥️ VPS Plan Details",
            value: `**Plan:** ${selectedPlan.name}\n**vCPU:** ${selectedPlan.vcpu}\n**RAM:** ${selectedPlan.ram}\n**Storage:** ${selectedPlan.storage}\n**Bandwidth:** ${selectedPlan.bandwidth}`,
            inline: true
          },
          {
            name: "💰 Pricing",
            value: `**Price:** ₹${selectedPlan.price}/mo`,
            inline: true
          },
          {
            name: "🎯 Server Purpose",
            value: `${formData.serverPurpose || 'Not specified'}`,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "JXFRCloud™ VPS Hosting"
        }
      };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });
    } catch (error) {
        console.error('Error sending VPS order to Discord:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const orderPayload = {
        userId: (session?.user as any)?.id,
        type: 'vps' as const,
        planName: selectedPlan.name,
        price: `₹${selectedPlan.price}/mo`,
        status: 'pending' as const,
        customerInfo: {
          ...formData,
          serverName: formData.serverPurpose || selectedPlan.name,
          password: password,
        },
    };
    
    const result = await createOrderAction(orderPayload);

    if (result.success && result.order) {
        setOrderId(result.order.id);
        await sendToDiscord(result.order.id, password);
        setIsSubmitted(true);
    } else {
        console.error("Failed to create VPS order:", result.message);
        alert(`Error: ${result.message}`);
    }
    
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-6 sm:p-8 text-center`}>
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4`}>VPS Order Submitted!</h2>
          <div className={`${themeStyles.card} p-4 rounded-xl mb-6 border`}>
            <p className={`text-sm ${themeStyles.textSecondary} mb-2`}>Your Order ID:</p>
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-lg font-bold ${themeStyles.text} font-mono`}>{orderId}</span>
              <button onClick={() => copyToClipboard(orderId, 'order')} className={`p-2 ${themeStyles.button} text-white rounded-lg transition-all duration-300 hover:scale-105`} title="Copy Order ID">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>}
          </div>
          <p className={`${themeStyles.textSecondary} mb-6 text-sm sm:text-base`}>
            Your VPS hosting order has been received. Create a ticket on Discord with this ID <strong>{orderId}</strong> and our team will contact you to confirm your order and set up your server.
          </p>
          <a href="https://discord.gg/1388084142075547680" target="_blank" rel="noopener noreferrer" className={`w-full ${themeStyles.button} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center mb-4 text-sm sm:text-base`}>
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Join Discord & Create Ticket
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </a>
          <button onClick={onBack} className={`w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base`}>
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg} py-4 sm:py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <button onClick={onBack} className={`flex items-center ${themeStyles.textSecondary} hover:text-blue-400 transition-colors text-sm sm:text-base`}>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Plans
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className={`${themeStyles.card} rounded-2xl p-4 sm:p-6 h-fit order-2 xl:order-1`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4 sm:mb-6`}>Order Summary</h2>
            <div className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 ${themeStyles.card} rounded-xl`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                {getPlanIcon(selectedPlan)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base sm:text-lg font-semibold ${themeStyles.text} truncate`}>{selectedPlan.name}</h3>
                <p className={`${themeStyles.textSecondary} text-sm capitalize`}>{selectedPlan.cpu} VPS</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-lg sm:text-xl font-bold ${themeStyles.text}`}>₹{selectedPlan.price}</div>
                <div className={`text-xs sm:text-sm ${themeStyles.textSecondary}`}>/month</div>
              </div>
            </div>

             <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} mt-4 pt-4`}>
                <h4 className={`text-base font-semibold ${themeStyles.text} mb-3`}>Server Credentials</h4>
                <div className={`${themeStyles.card} p-3 rounded-lg border`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${themeStyles.textSecondary} mb-1`}>Root Password</p>
                            <p className={`font-mono text-sm ${themeStyles.text}`}>{password}</p>
                        </div>
                        <button
                            onClick={() => copyToClipboard(password, 'password')}
                            className={`${themeStyles.button} text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors`}
                        >
                           {passwordCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} mt-4 pt-4`}>
              <div className="flex justify-between items-center">
                <span className={`text-lg sm:text-xl font-bold ${themeStyles.text}`}>Total</span>
                <span className="text-xl sm:text-2xl font-bold text-blue-400">₹{selectedPlan.price}/mo</span>
              </div>
            </div>
          </div>

          <div className={`${themeStyles.card} rounded-2xl p-4 sm:p-6 order-1 xl:order-2`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4 sm:mb-6`}>Customer Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`} placeholder="Enter first name" />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`} placeholder="Enter last name" />
                </div>
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${status === 'authenticated' ? 'opacity-75 cursor-not-allowed' : ''}`} placeholder="Enter email address" readOnly={status === 'authenticated'} />
                 {status === 'authenticated' && (
                  <p className={`text-xs ${themeStyles.textSecondary} mt-1 flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                    Auto-filled from Discord login
                  </p>
                )}
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />Discord Username *</label>
                <input type="text" name="discordUsername" value={formData.discordUsername} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${status === 'authenticated' ? 'opacity-75 cursor-not-allowed font-mono' : ''}`} placeholder="Enter Discord username" readOnly={status === 'authenticated'} />
                 {status === 'authenticated' && (
                  <p className={`text-xs ${themeStyles.textSecondary} mt-1 flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                    Auto-filled from Discord login
                  </p>
                )}
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <Server className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Server Purpose (Optional)
                </label>
                <textarea
                  name="serverPurpose"
                  value={formData.serverPurpose}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base resize-none`}
                  placeholder="What will you use this VPS for? (e.g., web hosting, development, applications)"
                />
              </div>
              <button type="submit" disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email || !formData.discordUsername} className={`w-full ${themeStyles.button} disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center text-sm sm:text-base`}>
                {isSubmitting ? (
                   <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                    Processing Order...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Submit VPS Order
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VPSPaymentForm;
