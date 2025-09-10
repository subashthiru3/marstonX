import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import { getIncidentsByUser, mockIncidents } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Plus, ClipboardList, BarChart3, CheckCircle2, Hourglass, Siren } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  // Get user's incidents
  const userIncidents = getIncidentsByUser(user?.id) || [];

  // Recent incidents table columns
  const incidentColumns = [
    {
      accessorKey: 'incidentType',
      header: 'Type',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => (
        <div className="max-w-xs truncate" title={getValue()}>
          {getValue()}
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ getValue }) => {
        const severity = getValue();
        const severityStyles = {
          Low: 'bg-green-100 text-green-800',
          Medium: 'bg-yellow-100 text-yellow-800',
          High: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityStyles[severity] || 'bg-gray-100 text-gray-800'}`}>
            {severity}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const statusStyles = {
          Resolved: 'bg-green-100 text-green-800',
          'Under Review': 'bg-yellow-100 text-yellow-800',
          'Under Investigation': 'bg-orange-100 text-orange-800',
          Pending: 'bg-blue-100 text-blue-800',
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
  ];

  // Calculate user stats
  const totalIncidents = userIncidents.length;
  const resolvedIncidents = userIncidents.filter(i => i.status === 'Resolved').length;
  const pendingIncidents = userIncidents.filter(i => i.status === 'Pending' || i.status === 'Under Review').length;
  const highSeverityIncidents = userIncidents.filter(i => i.severity === 'High').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your incident reports and track your fleet activities.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/user/new-incident"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Report New Incident</h3>
              <p className="text-blue-100">Create a new incident report</p>
            </div>
          </div>
        </Link>

        <Link
          to="/user/incidents"
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">View All Incidents</h3>
              <p className="text-green-100">See your complete incident history</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-semibold text-gray-900">{totalIncidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-green-100 text-green-700 rounded-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{resolvedIncidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-md">
              <Hourglass className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingIncidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-md">
              <Siren className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">{highSeverityIncidents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Incidents</h2>
            <p className="text-gray-600">Your latest incident reports</p>
          </div>
          <Link
            to="/user/incidents"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {userIncidents.length > 0 ? (
          <DataTable
            data={userIncidents.slice(0, 5)} // Show only recent 5
            columns={incidentColumns}
            searchPlaceholder="Search incidents..."
            showSearch={false}
            pageSize={5}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">
              <ClipboardList className="inline w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents yet</h3>
            <p className="text-gray-600 mb-4">You haven't reported any incidents yet.</p>
            <Link
              to="/user/new-incident"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Report Your First Incident
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
