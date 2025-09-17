'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { ArrowLeft, User, Mail, MessageCircle, Send, CheckCircle, Gamepad2, ExternalLink, Plus, Minus, Zap, Star, Shield, Copy, Ticket } from 'lucide-react';
import { createOrderAction } from '@/app/actions';
import { validateCouponAction } from '@/app/admin/coupons/actions';
import type { Coupon } from '@/app/admin/coupons/types';
import type { MinecraftPlan } from '@/lib/types';
import toast from 'react-hot-toast';


interface PaymentFormProps {
  selectedPlan: MinecraftPlan;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ selectedPlan, onBack }) => {
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
    email: session?.user?.email || '',
    discordUsername: (session?.user as any)?.username || '',
    serverName: ''
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if ((name === 'discordUsername' || name === 'email') && status === 'authenticated') {
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (appliedCoupon) {
      const discount = selectedPlan.price * (appliedCoupon.discount_percentage / 100);
      return Math.round(selectedPlan.price - discount);
    }
    return selectedPlan.price;
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
        toast.error('Please enter a coupon code.');
        return;
    }
    setIsApplyingCoupon(true);
    const result = await validateCouponAction(couponCode, (session?.user as any).id);
    if (result.success && result.coupon) {
        setAppliedCoupon(result.coupon);
        toast.success(result.message);
    } else {
        setAppliedCoupon(null);
        toast.error(result.message);
    }
    setIsApplyingCoupon(false);
  };


  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          button: 'bg-gradient-to-r from-slate-800 to-emerald-900 hover:from-slate-700 hover:to-emerald-800',
          input: 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
        };
      default: // dark or glass
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-green-900/20',
          card: 'bg-white/10 backdrop-blur-md border-white/20',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          button: 'bg-gradient-to-r from-slate-800 to-emerald-900 hover:from-slate-700 hover:to-emerald-800',
          input: 'bg-white/10 border-white/20 text-white placeholder-gray-400'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const getPlanTypeIcon = (plan: MinecraftPlan) => {
      if (plan.is_popular) return <Star className="w-5 h-5 text-yellow-400" />;
      if (plan.category === 'premium') return <Star className="w-5 h-5 text-purple-400" />;
      if (plan.category === 'powered') return <Zap className="w-5 h-5 text-orange-400" />;
      if (plan.category === 'budget') return <Shield className="w-5 h-5 text-green-400" />;
      return <Gamepad2 className="w-5 h-5 text-blue-400" />;
  };

  const sendToDiscord = async (generatedOrderId: string) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1393999338329604126/zo9VrQY1cyoLp4ZgLpf8BytjQKF_nH6rYgZHAVDhF8L2IIOod2fdbWv04ds072olZ6Wl';
    
    const embed = {
      title: '🎮 New Minecraft Hosting Order!',
      color: 0x10B981, // Emerald color
      fields: [
          { name: '🆔 Order ID', value: `\`${generatedOrderId}\`` },
          {
              name: '👤 Customer Information',
              value: `**Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Discord:** ${formData.discordUsername}`
          },
          {
              name: '🎯 Plan Details',
              value: `**Plan:** ${selectedPlan.name}\n**RAM:** ${selectedPlan.ram}\n**CPU:** ${selectedPlan.cpu}\n**Storage:** ${selectedPlan.storage}`
          },
          {
              name: '💰 Pricing',
              value: `**Original Price:** ₹${selectedPlan.price}/month\n${appliedCoupon ? `**Coupon:** \`${appliedCoupon.code}\` (${appliedCoupon.discount_percentage}% off)\n` : ''}**Final Price:** ₹${calculateTotal()}/month`
          },
          {
              name: '🎮 Server Details',
              value: `**Server Name:** ${formData.serverName || 'Not Specified'}`
          }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'JXFRCloud™ Minecraft Hosting' }
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (error) {
      console.log('Error sending to Discord:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const orderPayload = {
        userId: (session?.user as any)?.id,
        type: 'hosting' as const,
        planName: selectedPlan.name,
        price: `₹${calculateTotal()}/mo`,
        status: 'pending' as const,
        customerInfo: formData,
        couponId: appliedCoupon?.id
    };
    
    const result = await createOrderAction(orderPayload);

    if (result.success && result.order) {
        setOrderId(result.order.id);
        await sendToDiscord(result.order.id);
        setIsSubmitted(true);
    } else {
        toast.error(result.message || 'Failed to create order.');
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
          <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4`}>Order Submitted Successfully!</h2>
          
          <div className={`${themeStyles.card} p-4 rounded-xl mb-6 border`}>
            <p className={`text-sm ${themeStyles.textSecondary} mb-2`}>Your Order ID:</p>
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-lg font-bold ${themeStyles.text} font-mono`}>{orderId}</span>
              <button
                onClick={() => copyToClipboard(orderId)}
                className={`p-2 ${themeStyles.button} text-white rounded-lg transition-all duration-300 hover:scale-105`}
                title="Copy Order ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>}
          </div>

          <p className={`${themeStyles.textSecondary} mb-6 text-sm sm:text-base`}>
            Your order has been received. Create a ticket on Discord with this ID <strong>{orderId}</strong> and our team will contact you to confirm and set up your server.
          </p>
          
          <div className="mb-6">
            <a
              href="https://discord.gg/1388084142075547680"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full ${themeStyles.button} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center mb-4 text-sm sm:text-base`}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Join Discord & Create Ticket
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </a>
          </div>

          <button
            onClick={onBack}
            className={`w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base`}
          >
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
          <button
            onClick={onBack}
            className={`flex items-center ${themeStyles.textSecondary} hover:text-purple-400 transition-colors text-sm sm:text-base`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Plans
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Summary */}
          <div className={`${themeStyles.card} rounded-2xl p-4 sm:p-6 h-fit order-2 xl:order-1`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4 sm:mb-6`}>Order Summary</h2>
            
            <div className="space-y-4 mb-4 sm:mb-6">
              <div className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 ${themeStyles.card} rounded-xl`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-slate-800 to-emerald-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getPlanTypeIcon(selectedPlan)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base sm:text-lg font-semibold ${themeStyles.text} truncate`}>{selectedPlan.name} Plan</h3>
                   <p className={`${themeStyles.textSecondary} text-sm capitalize`}>{selectedPlan.category || 'Standard'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg sm:text-xl font-bold ${themeStyles.text} ${appliedCoupon ? 'line-through text-muted-foreground' : ''}`}>
                    ₹{selectedPlan.price}
                  </div>
                  <div className={`text-xs sm:text-sm ${themeStyles.textSecondary}`}>/month</div>
                </div>
              </div>

            </div>

             <div className="space-y-4">
                <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} pt-4`}>
                    <div className="flex items-center gap-2">
                         <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon Code" className={`flex-grow px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`} disabled={!!appliedCoupon} />
                         <button onClick={handleApplyCoupon} className={`${themeStyles.button} text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50`} disabled={isApplyingCoupon || !!appliedCoupon}>
                            {isApplyingCoupon ? 'Applying...' : appliedCoupon ? 'Applied' : 'Apply'}
                         </button>
                    </div>
                </div>
                
                 {appliedCoupon && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-green-400 flex items-center gap-2"><Ticket className="w-4 h-4"/>Coupon '{appliedCoupon.code}' applied</span>
                        <span className="font-bold text-green-400">-{appliedCoupon.discount_percentage}%</span>
                    </div>
                )}

                <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} pt-4`}>
                    <div className="flex justify-between items-center">
                        <span className={`text-lg sm:text-xl font-bold ${themeStyles.text}`}>Total</span>
                        <span className="text-xl sm:text-2xl font-bold text-emerald-400">₹{calculateTotal()}/mo</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Order Form */}
          <div className={`${themeStyles.card} rounded-2xl p-4 sm:p-6 order-1 xl:order-2`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4 sm:mb-6`}>Customer Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base`} placeholder="Enter first name" />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base`} placeholder="Enter last name" />
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base ${status === 'authenticated' ? 'opacity-75 cursor-not-allowed' : ''}`} placeholder="Enter email address" readOnly={status === 'authenticated'} />
                 {status === 'authenticated' && <p className={`text-xs ${themeStyles.textSecondary} mt-1 flex items-center`}><CheckCircle className="w-3 h-3 mr-1 text-green-400" />Auto-filled from Discord</p>}
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />Discord Username *</label>
                <input type="text" name="discordUsername" value={formData.discordUsername} onChange={handleInputChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base ${status === 'authenticated' ? 'opacity-75 cursor-not-allowed font-mono' : ''}`} placeholder="Enter Discord username" readOnly={status === 'authenticated'} />
                {status === 'authenticated' && <p className={`text-xs ${themeStyles.textSecondary} mt-1 flex items-center`}><CheckCircle className="w-3 h-3 mr-1 text-green-400" />Auto-filled from Discord</p>}
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}><Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />Server Name (Optional)</label>
                <input type="text" name="serverName" value={formData.serverName} onChange={handleInputChange} className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base`} placeholder="My Awesome Server" />
              </div>

              <button type="submit" disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email || !formData.discordUsername} className={`w-full ${themeStyles.button} disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center text-sm sm:text-base`}>
                {isSubmitting ? (
                  <><div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:h-5 border-b-2 border-white mr-2 sm:mr-3"></div>Processing...</>
                ) : (
                  <><Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />Submit Order</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
