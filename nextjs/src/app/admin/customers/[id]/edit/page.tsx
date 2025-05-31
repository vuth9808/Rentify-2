'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { customerService, CustomerDTO } from '@/services/customerService';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCustomerPage({ params }: PageProps) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<number>(0);
  
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setCustomerId(parseInt(resolvedParams.id));
    };
    getParams();
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerDTO>({
    id: customerId,
    fullName: '',
    phone: '',
    email: '',
    company: '',
    requirement: '',
    demand: '',
    note: '',
    status: 'LEAD'
  });

  useEffect(() => {
    if (customerId === 0) return;

    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(customerId);
        setFormData({
          ...data,
          id: customerId
        });
        setError(null);
      } catch (err: unknown) {
        console.error('Failed to fetch customer:', err);
        const error = err as Error;
        setError('Không thể tải thông tin khách hàng. ' + (error.message || 'Vui lòng thử lại sau.'));
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await customerService.saveCustomer(formData);
      router.push('/admin/customers');
      router.refresh();
    } catch (err: unknown) {
      console.error('Failed to update customer:', err);
      const error = err as Error;
      setError('Không thể cập nhật khách hàng. ' + (error.message || 'Vui lòng thử lại sau.'));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa khách hàng: {formData.fullName}</h1>
        <Link
          href="/admin/customers"
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
        >
          Quay lại
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Công ty
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="demand" className="block text-sm font-medium text-gray-700 mb-1">
                Nhu cầu
              </label>
              <input
                type="text"
                id="demand"
                name="demand"
                value={formData.demand || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="requirement" className="block text-sm font-medium text-gray-700 mb-1">
                Yêu cầu
              </label>
              <input
                type="text"
                id="requirement"
                name="requirement"
                value={formData.requirement || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || 'LEAD'}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LEAD">Lead</option>
                <option value="POTENTIAL">Tiềm năng</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/customers')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-4 hover:bg-gray-400 transition duration-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Cập nhật khách hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 