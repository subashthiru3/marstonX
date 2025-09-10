import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import { mockVehicles, mockUsers, mockIncidents } from '../data/mockData';
import { Car, CheckCircle2, Users, TriangleAlert } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Vehicle table columns
  const vehicleColumns = [
    {
      accessorKey: 'vehicleNumber',
      header: 'Vehicle #',
      cell: ({ getValue }) => (
        <span className="font-medium text-blue-600">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'make',
      header: 'Make',
    },
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'year',
      header: 'Year',
    },
    {
      accessorKey: 'licensePlate',
      header: 'License Plate',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const statusStyles = {
          Active: 'bg-green-100 text-green-800',
          Maintenance: 'bg-yellow-100 text-yellow-800',
          Inactive: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'assignedOfficer',
      header: 'Assigned Officer',
    },
  ];

  // User table columns
  const userColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ getValue }) => {
        const role = getValue();
        return (
          <span className="capitalize px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const statusStyles = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'incidentsCount',
      header: 'Incidents',
      cell: ({ getValue }) => (
        <span className="text-center inline-block w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
          {getValue()}
        </span>
      ),
    },
  ];

  // Calculate dashboard stats
  const totalVehicles = mockVehicles.length;
  const activeVehicles = mockVehicles.filter(v => v.status === 'Active').length;
  const totalUsers = mockUsers.length;
  const totalIncidents = mockIncidents.length;
  const pendingIncidents = mockIncidents.filter(i => i.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your fleet incident management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-md">
              <Car className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-semibold text-gray-900">{totalVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-green-100 text-green-700 rounded-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
              <p className="text-2xl font-semibold text-gray-900">{activeVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-md">
              <Users className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-md">
              <TriangleAlert className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Incidents</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingIncidents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Management Section */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Management</h2>
          <p className="text-gray-600">Monitor and manage your fleet vehicles</p>
        </div>
        <DataTable
          data={mockVehicles}
          columns={vehicleColumns}
          searchPlaceholder="Search vehicles..."
        />
      </div>

      {/* User Management Section */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600">Manage enforcement agents and administrators</p>
        </div>
        <DataTable
          data={mockUsers}
          columns={userColumns}
          searchPlaceholder="Search users..."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
