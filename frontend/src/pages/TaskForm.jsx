import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { taskAPI } from '../services/api';
import { FiSave, FiX } from 'react-icons/fi';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    uniqueId: '',
    soId: '',
    clientCode: '',
    productCode: '',
    productName: '',
    batchNumber: '',
    batchSize: '',
    quantity: '',
    dueDate: '',
    assignedTo: '',
    orderType: 'OTHER',
    status: 'PENDING'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch task data if editing
  const { data: taskData, isLoading: taskLoading } = useQuery(
    ['task', id],
    () => taskAPI.getTask(id),
    {
      enabled: isEditing,
      onSuccess: (data) => {
        if (data.data.success) {
          const task = data.data.task;
          setFormData({
            uniqueId: task.uniqueId || '',
            soId: task.soId || '',
            clientCode: task.clientCode || '',
            productCode: task.productCode || '',
            productName: task.productName || '',
            batchNumber: task.batchNumber || '',
            batchSize: task.batchSize || '',
            quantity: task.quantity || '',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            assignedTo: task.assignedTo || '',
            orderType: task.orderType || 'OTHER',
            status: task.status || 'PENDING'
          });
        }
      }
    }
  );

  // Create task mutation
  const createTaskMutation = useMutation(
    (taskData) => taskAPI.createTask(taskData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        navigate('/');
      },
    }
  );

  // Update task mutation
  const updateTaskMutation = useMutation(
    ({ id, taskData }) => taskAPI.updateTask(id, taskData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries(['task', id]);
        navigate('/');
      },
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.uniqueId.trim()) {
      setError('Unique ID is required');
      setLoading(false);
      return;
    }

    if (!formData.clientCode.trim()) {
      setError('Client Code is required');
      setLoading(false);
      return;
    }

    if (!formData.productCode.trim()) {
      setError('Product Code is required');
      setLoading(false);
      return;
    }

    if (!formData.dueDate) {
      setError('Due Date is required');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateTaskMutation.mutateAsync({
          id,
          taskData: {
            uniqueId: formData.uniqueId.trim(),
            soId: formData.soId.trim(),
            clientCode: formData.clientCode.trim(),
            productCode: formData.productCode.trim(),
            productName: formData.productName.trim(),
            batchNumber: formData.batchNumber.trim(),
            batchSize: parseInt(formData.batchSize) || 0,
            quantity: parseInt(formData.quantity) || 0,
            dueDate: formData.dueDate,
            assignedTo: formData.assignedTo.trim(),
            orderType: formData.orderType,
            status: formData.status
          }
        });
      } else {
        await createTaskMutation.mutateAsync({
          uniqueId: formData.uniqueId.trim(),
          soId: formData.soId.trim(),
          clientCode: formData.clientCode.trim(),
          productCode: formData.productCode.trim(),
          productName: formData.productName.trim(),
          batchNumber: formData.batchNumber.trim(),
          batchSize: parseInt(formData.batchSize) || 0,
          quantity: parseInt(formData.quantity) || 0,
          dueDate: formData.dueDate,
          assignedTo: formData.assignedTo.trim(),
          orderType: formData.orderType
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isEditing && taskLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Dispatch' : 'Create New Dispatch'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700 mb-2">
                Unique ID *
              </label>
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                placeholder="e.g., SO-024656-044"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="soId" className="block text-sm font-medium text-gray-700 mb-2">
                SO ID *
              </label>
              <input
                type="text"
                id="soId"
                name="soId"
                value={formData.soId}
                onChange={handleChange}
                placeholder="e.g., 1233"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="clientCode" className="block text-sm font-medium text-gray-700 mb-2">
                Client Code *
              </label>
              <input
                type="text"
                id="clientCode"
                name="clientCode"
                value={formData.clientCode}
                onChange={handleChange}
                placeholder="e.g., C10005"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-2">
                Product Code *
              </label>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                placeholder="e.g., 20010069"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Product Information */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g., COMPRESSOR WIRE HARNESS"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Batch Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                id="batchNumber"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                placeholder="e.g., 1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                id="batchSize"
                name="batchSize"
                value={formData.batchSize}
                onChange={handleChange}
                placeholder="e.g., 2000"
                min="1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 4000"
                min="1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Dates and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
          </div>

          <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
            </label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
              onChange={handleChange}
                placeholder="e.g., John Doe"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            </div>
          </div>

          {/* Order Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-2">
                Order Type
              </label>
              <select
                id="orderType"
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="OTHER">Other</option>
                <option value="POWER_CORD">Power Cord</option>
                <option value="COMPRESSOR">Compressor</option>
                <option value="WIRE">Wire</option>
              </select>
            </div>

            {isEditing && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                  <option value="PENDING">Pending</option>
                  <option value="DISPATCH">Dispatch</option>
                  <option value="STORE_1">Store 1</option>
                  <option value="STORE_2">Store 2</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiX className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FiSave className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : (isEditing ? 'Update Dispatch' : 'Create Dispatch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;