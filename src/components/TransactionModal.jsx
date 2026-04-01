import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/mockData';

const inputCls = "w-full px-3 py-2 text-sm border border-[#E5E5E5] dark:border-[#262626] rounded-md bg-white dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#F7F7F5] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#0033CC] transition-colors";
const labelCls = "block text-[10px] text-[#525252] dark:text-[#A3A3A3] uppercase tracking-[0.15em] font-medium mb-1.5";

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, editTransaction } = useApp();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    date:        transaction?.date        || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    amount:      transaction?.amount?.toString() || '',
    category:    transaction?.category    || 'Food & Dining',
    type:        transaction?.type        || 'expense',
    merchant:    transaction?.merchant    || '',
  });
  const [errors, setErrors] = useState({});

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Required';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = { ...form, amount: parseFloat(form.amount) };
    isEdit ? editTransaction(transaction.id, payload) : addTransaction(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      data-testid="transaction-modal"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] dark:border-[#262626]">
          <div>
            <p className="text-[10px] text-[#A3A3A3] tracking-[0.2em] uppercase">
              {isEdit ? 'Edit Transaction' : 'New Transaction'}
            </p>
            <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#F7F7F5] mt-0.5">
              {isEdit ? 'Modify existing record' : 'Add a new record'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F7F7F5] dark:hover:bg-[#262626] rounded-md transition-colors"
            data-testid="close-modal-btn"
          >
            <X size={16} className="text-[#525252] dark:text-[#A3A3A3]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select
                value={form.type}
                onChange={e => { set('type', e.target.value); set('category', e.target.value === 'income' ? 'Salary' : 'Food & Dining'); }}
                className={inputCls}
                data-testid="modal-type-select"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className={inputCls}
                data-testid="modal-date-input"
              />
              {errors.date && <p className="text-[11px] text-[#D82C0D] mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <input
              type="text"
              placeholder="e.g. Monthly Salary"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className={inputCls}
              data-testid="modal-description-input"
            />
            {errors.description && <p className="text-[11px] text-[#D82C0D] mt-1">{errors.description}</p>}
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                className={inputCls}
                data-testid="modal-amount-input"
              />
              {errors.amount && <p className="text-[11px] text-[#D82C0D] mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={inputCls}
                data-testid="modal-category-select"
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Merchant */}
          <div>
            <label className={labelCls}>Merchant / Source</label>
            <input
              type="text"
              placeholder="e.g. Amazon, TechCorp"
              value={form.merchant}
              onChange={e => set('merchant', e.target.value)}
              className={inputCls}
              data-testid="modal-merchant-input"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm border border-[#E5E5E5] dark:border-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] hover:bg-[#F7F7F5] dark:hover:bg-[#262626] transition-colors font-medium"
              data-testid="cancel-modal-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm bg-[#0A0A0A] dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] rounded-md hover:opacity-90 transition-opacity font-semibold"
              data-testid="submit-transaction-btn"
            >
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
