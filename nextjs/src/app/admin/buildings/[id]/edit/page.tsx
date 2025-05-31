'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buildingService, BuildingDTO } from '@/services/buildingService';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBuildingPage({ params }: PageProps) {
  const router = useRouter();
  const [buildingId, setBuildingId] = useState<number>(0);
  
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setBuildingId(parseInt(resolvedParams.id));
    };
    getParams();
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BuildingDTO>({
    id: buildingId,
    name: '',
    street: '',
    ward: '',
    district: '',
    floorArea: 0,
    rentPrice: 0,
    managerName: '',
    managerPhone: '',
    image: '',
    structure: '',
    numberOfBasement: 0,
    direction: '',
    level: '',
    rentPriceDescription: '',
    serviceFee: '',
    brokerageFee: '',
    typeCode: '',
  });

  useEffect(() => {
    if (buildingId === 0) return;

    const fetchBuilding = async () => {
      try {
        const data = await buildingService.getBuildingById(buildingId);
        setFormData({
          ...data,
          id: buildingId,
          serviceFee: data.serviceFee?.toString() || '',
          brokerageFee: data.brokerageFee?.toString() || '',
        });
        setError(null);
      } catch (err: unknown) {
        console.error('Failed to fetch building:', err);
        const error = err as Error;
        setError('Không thể tải thông tin tòa nhà. ' + (error.message || 'Vui lòng thử lại sau.'));
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [buildingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['floorArea', 'rentPrice', 'numberOfBasement'].includes(name) 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const buildingToSave: BuildingDTO = {
        ...formData,
        floorArea: formData.floorArea,
        rentPrice: formData.rentPrice,
        numberOfBasement: formData.numberOfBasement,
        serviceFee: formData.serviceFee?.toString() || '',
        brokerageFee: formData.brokerageFee?.toString() || '',
      };
      
      await buildingService.saveBuilding(buildingToSave);
      router.push('/admin/buildings');
      router.refresh();
    } catch (err: unknown) {
      console.error('Failed to update building:', err);
      const error = err as Error;
      setError('Không thể cập nhật tòa nhà. ' + (error.message || 'Vui lòng thử lại sau.'));
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
        <h1 className="text-2xl font-bold">Chỉnh sửa tòa nhà: {formData.name}</h1>
        <Link
          href="/admin/buildings"
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên tòa nhà <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Đường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                Phường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="structure" className="block text-sm font-medium text-gray-700 mb-1">
                Kết cấu
              </label>
              <input
                type="text"
                id="structure"
                name="structure"
                value={formData.structure || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="numberOfBasement" className="block text-sm font-medium text-gray-700 mb-1">
                Số tầng hầm
              </label>
              <input
                type="number"
                id="numberOfBasement"
                name="numberOfBasement"
                value={formData.numberOfBasement || 0}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="floorArea" className="block text-sm font-medium text-gray-700 mb-1">
                Diện tích (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="floorArea"
                name="floorArea"
                value={formData.floorArea || 0}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
                Hướng
              </label>
              <input
                type="text"
                id="direction"
                name="direction"
                value={formData.direction || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Hạng
              </label>
              <input
                type="text"
                id="level"
                name="level"
                value={formData.level || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rentPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Giá thuê <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="rentPrice"
                name="rentPrice"
                value={formData.rentPrice || 0}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="rentPriceDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả giá
              </label>
              <input
                type="text"
                id="rentPriceDescription"
                name="rentPriceDescription"
                value={formData.rentPriceDescription || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="serviceFee" className="block text-sm font-medium text-gray-700 mb-1">
                Phí dịch vụ
              </label>
              <input
                type="text"
                id="serviceFee"
                name="serviceFee"
                value={formData.serviceFee || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="brokerageFee" className="block text-sm font-medium text-gray-700 mb-1">
                Phí môi giới
              </label>
              <input
                type="text"
                id="brokerageFee"
                name="brokerageFee"
                value={formData.brokerageFee || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="typeCode" className="block text-sm font-medium text-gray-700 mb-1">
                Loại tòa nhà
              </label>
              <input
                type="text"
                id="typeCode"
                name="typeCode"
                value={formData.typeCode || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="managerName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên người quản lý <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="managerName"
                name="managerName"
                value={formData.managerName || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="managerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại quản lý <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="managerPhone"
                name="managerPhone"
                value={formData.managerPhone || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Đường dẫn hình ảnh
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/buildings')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-4 hover:bg-gray-400 transition duration-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Cập nhật tòa nhà'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 