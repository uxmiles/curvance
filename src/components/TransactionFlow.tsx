'use client';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TransactionFlowProps {
  status: 'processing' | 'approving' | 'depositing' | 'approved';
  amount: string;
  token: string;
  isZapping?: boolean;
  fromToken?: string;
  onViewTransaction?: () => void;
  onViewPosition?: () => void;
  onBack?: () => void;
}

export function TransactionFlow({ status, amount, token, isZapping = false, fromToken, onViewTransaction, onViewPosition, onBack }: TransactionFlowProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    { id: 1, label: 'Plugin', completed: status !== 'processing' },
    { id: 2, label: 'Approval', completed: status === 'depositing' || status === 'approved' },
    { id: 3, label: 'Deposit', completed: status === 'approved' },
    { id: 4, label: 'Successful', completed: status === 'approved' },
  ];

  const getTitle = () => {
    switch (status) {
      case 'processing':
        return 'Processing Transaction';
      case 'approving':
        return 'Approving Transaction';
      case 'depositing':
        return 'Depositing Assets';
      case 'approved':
        return 'Transaction Completed';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'processing':
        return isZapping ? 'Initializing swap and deposit' : 'Initializing transaction';
      case 'approving':
        return isZapping ? 'Approving swap transaction' : 'Waiting for approval confirmation';
      case 'depositing':
        return isZapping ? `Swapping ${fromToken} for ${token} and depositing` : 'Confirming deposit on blockchain';
      case 'approved':
        return isZapping ? `Swapped and deposited ${token} successfully` : `${amount} ${token} deposit successful`;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 transition-opacity duration-500 flex-1 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Icon */}
      <div className="mb-6">
        {status !== 'approved' ? (
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          </div>
        )}
      </div>

      {/* Title and Description */}
      <div className="text-center mb-8">
        <h3 className="text-xl text-white mb-2">
          {getTitle()}
        </h3>
        <p className="text-white/50 text-sm">
          {getDescription()}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-3 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                  step.completed 
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}
              >
                {step.completed ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>
              <span className={`text-xs ${step.completed ? 'text-emerald-400' : 'text-white/40'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-[2px] mb-6 transition-all ${
                step.completed && steps[index + 1].completed
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {status === 'approved' && (
        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={onViewTransaction}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all whitespace-nowrap"
          >
            View Transaction
          </button>
          <button
            onClick={onViewPosition}
            className="relative flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#5740CE] to-[#8B5CF6] hover:from-[#6D4FDD] hover:to-[#9D6EFF] text-white transition-all shadow-lg shadow-[#5740CE]/30 hover:shadow-xl hover:shadow-[#5740CE]/50 font-medium before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-[#5740CE] before:to-[#8B5CF6] before:-z-10 before:blur-sm before:opacity-75 hover:before:opacity-100 before:transition-opacity whitespace-nowrap"
          >
            View Position
          </button>
        </div>
      )}

      {/* Back button for processing state */}
      {status === 'processing' && (
        <button
          onClick={onBack}
          className="mt-4 text-white/50 hover:text-white/80 text-sm transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}