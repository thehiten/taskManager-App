import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiCheck, FiClock, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasksData, isLoading, error } = useQuery(
    ['tasks', { searchTerm, statusFilter, currentPage, sortBy, sortOrder }],
    () => taskAPI.getTasks({
      search: searchTerm,
      status: statusFilter,
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder
    }),
    {
      keepPreviousData: true,
    }
  );

  // Update task status mutation
  const updateTaskMutation = useMutation(
    ({ id, status }) => taskAPI.updateTask(id, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  // Delete task mutation
  const deleteTaskMutation = useMutation(
    (id) => taskAPI.deleteTask(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const handleStatusToggle = (task) => {
    const newStatus = task.status === 'pending' ? 'done' : 'pending';
    updateTaskMutation.mutate({ id: task._id, status: newStatus });
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const tasks = tasksData?.data?.tasks || [];
  const pagination = tasksData?.data?.pagination || {};

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Error loading tasks. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <Link
          to="/tasks/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          New Task
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-500">
            {pagination.totalTasks} task{pagination.totalTasks !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow rounded-lg">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating your first task.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/tasks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="h-4 w-4 mr-2" />
                Create Task
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleStatusToggle(task)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.status === 'done'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {task.status === 'done' && <FiCheck className="h-3 w-3" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium ${
                          task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <p className={`mt-1 text-sm ${
                          task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <FiClock className="h-3 w-3 mr-1" />
                            {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'done'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/tasks/${task._id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FiEdit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

