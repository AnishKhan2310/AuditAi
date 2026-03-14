import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Zap, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

const Billing = () => {
  const { user, setAuth, accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSubscribe = async (planName) => {
    try {
      setLoadingPlan(planName);
      // Convert plan name to proper case for backend
      const planMap = {
        starter: "Starter",
        growth: "Growth",
        enterprise: "Enterprise"
      };
      const properPlan = planMap[planName] || planName;
      
      const res = await api.post("/auth/subscribe", { 
        plan: properPlan, 
        email: user.email 
      });
      
      setAuth(accessToken, { ...user, plan: properPlan });
      toast.success(`Plan updated to ${properPlan}!`);
    } catch (error) {
      toast.error("Failed to update subscription.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "starter",
      price: "$0",
      icon: <Zap className="text-yellow-600" />,
      features: ["Access to Basic Features", "Basic Risk Scoring", "Community Support"],
    },
    {
      name: "growth",
      price: "$49",
      icon: <Crown className="text-yellow-500" />,
      features: ["Unlimited Analysis", "Access to Advanced Features", "1-on-1 Consultations"],
      popular: true,
    },
    {
      name: "enterprise",
      price: "$100",
      icon: <ShieldCheck className="text-yellow-700" />,
      features: ["Unlimited Analysis", "Team Collaboration", "Dedicated Manager"],
    }
  ];

  return (
    <div className="min-h-screen bg-yellow-50/30 p-4 md:p-10 font-sans">
      {/* HEADER & BACK NAVIGATION */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-yellow-950/60 hover:text-yellow-950 mb-4 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm uppercase tracking-wider">Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-black text-yellow-950 tracking-tight">Billing & Plans</h1>
          <p className="text-yellow-900/60 font-medium mt-1">Manage your subscription and usage limits.</p>
        </div>

        {/* CURRENT STATUS PILL */}
        <div className="bg-white border-2 border-yellow-950/5 px-6 py-4 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Zap className="text-yellow-950" size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-yellow-950/40 tracking-widest">Active Plan</p>
            <p className="text-lg font-bold text-yellow-950 capitalize">{user?.plan || "Starter"}</p>
          </div>
        </div>
      </div>

      {/* PRICING GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
        {plans.map((plan) => {
          const isCurrent = (user?.plan || "Starter").toLowerCase() === plan.name;
          
          // Check if this plan should be disabled (cannot downgrade)
          const currentPlanTier = { starter: 1, growth: 2, enterprise: 3 }[(user?.plan || "Starter").toLowerCase()];
          const planTier = { starter: 1, growth: 2, enterprise: 3 }[plan.name];
          const isDowngrade = planTier < currentPlanTier;
          const isDisabled = isCurrent || isDowngrade || loadingPlan === plan.name;
          
          return (
            <div 
              key={plan.name} 
              className={`relative bg-white rounded-[2.5rem] p-8 transition-all duration-300 border-2 flex flex-col
                ${plan.popular ? "border-yellow-400 shadow-2xl scale-105 z-10 h-[520px]" : "border-yellow-950/5 shadow-xl h-[480px] hover:-translate-y-2"}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter shadow-md">
                  Recommended
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-yellow-50 rounded-2xl">
                  {plan.icon}
                </div>
                {isCurrent && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    Active
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-yellow-950 capitalize mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-yellow-950">{plan.price !== "Custom" ? `${plan.price}` : plan.price}</span>
                {plan.price !== "Custom" && <span className="text-yellow-950/40 font-bold">/mo</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-yellow-950/70 font-medium text-sm">
                    <div className="bg-yellow-100 rounded-full p-1">
                      <Check size={12} className="text-yellow-700" strokeWidth={4} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={isDisabled}
                className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg
                  ${isDisabled 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                    : plan.popular 
                      ? "bg-yellow-400 text-yellow-950 hover:bg-yellow-350 shadow-yellow-200" 
                      : "bg-yellow-950 text-white hover:bg-yellow-900 shadow-yellow-900/20"
                  }
                `}
              >
                {isCurrent ? "Current Plan" : isDowngrade ? "Downgrade" : loadingPlan === plan.name ? "Updating..." : "Upgrade Now"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-12 text-yellow-950/40 text-sm font-medium">
        Need help? Contact our support team for custom enterprise billing solutions.
      </p>
    </div>
  );
};

export default Billing;