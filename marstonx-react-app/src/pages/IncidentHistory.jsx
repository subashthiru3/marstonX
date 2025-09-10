import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import { getIncidentsByUser, getSavedIncidents } from '../data/mockData';
import { 
  BarChart3, 
  CheckCircle2, 
  Hourglass, 
  SearchCheck, 
  Filter, 
  Calendar,
  AlertTriangle,
  Car,
  Download,
  Eye,
  FileImage
} from 'lucide-react';

const IncidentHistory = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Load incidents on component mount
  useEffect(() => {
    const loadIncidents = () => {
      try {
        // Get mock incidents for this user
        const mockIncidents = getIncidentsByUser(user?.id) || [];

        // Get saved incidents from localStorage
        const savedIncidents = getSavedIncidents(user?.id) || [];

        // Combine and sort by date (newest first)
        const allIncidents = [...mockIncidents, ...savedIncidents]
          .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

        setIncidents(allIncidents);
      } catch (error) {
        console.error('Error loading incidents:', error);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, [user?.id]);

  // Filter incidents based on search and filters
  useEffect(() => {
    filterIncidents();
  }, [incidents, searchTerm, statusFilter, severityFilter, typeFilter, dateRange]);

  const filterIncidents = () => {
    let filtered = incidents;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    // Severity filter
    if (severityFilter !== 'All') {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(incident => incident.incidentType === typeFilter);
    }

    // Date range filter
    if (dateRange !== 'All') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          filterDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      if (dateRange !== 'All') {
        filtered = filtered.filter(incident => {
          const incidentDate = new Date(incident.date);
          return incidentDate >= filterDate;
        });
      }
    }

    setFilteredIncidents(filtered);
  };

  const getUniqueTypes = () => {
    return [...new Set(incidents.map(i => i.incidentType))];
  };

  const exportIncidents = () => {
    const csvContent = [
      ['Type', 'Vehicle', 'Description', 'Location', 'Date', 'Time', 'Severity', 'Status', 'Notes'],
      ...filteredIncidents.map(i => [
        i.incidentType,
        i.vehicleNumber,
        i.description,
        i.location,
        i.date,
        i.time,
        i.severity,
        i.status,
        i.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-incidents.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Incident table columns
  const incidentColumns = [
    {
      accessorKey: 'incidentType',
      header: 'Type',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'vehicleNumber',
      header: 'Vehicle',
      cell: ({ getValue }) => (
        <span className="font-medium text-blue-600">{getValue()}</span>
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
      accessorKey: 'location',
      header: 'Location',
      cell: ({ getValue }) => (
        <div className="max-w-xs truncate" title={getValue()}>
          {getValue()}
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue, row }) => (
        <div className="text-sm">
          <div className="font-medium">{getValue()}</div>
          <div className="text-gray-500">{row.original.time}</div>
        </div>
      ),
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
      cell: ({ getValue, row }) => {
        const status = getValue();
        const statusStyles = {
          Resolved: 'bg-green-100 text-green-800',
          'Under Review': 'bg-yellow-100 text-yellow-800',
          'Under Investigation': 'bg-orange-100 text-orange-800',
          Pending: 'bg-blue-100 text-blue-800',
        };

        return (
          <div className="space-y-1">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
              {status}
            </span>
            {row.original.approvedBy && (
              <div className="text-xs text-gray-500">
                by {row.original.approvedBy}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ getValue }) => {
        const notes = getValue();
        if (!notes) return <span className="text-gray-400">-</span>;

        return (
          <div className="max-w-xs truncate text-sm text-gray-600" title={notes}>
            {notes}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedIncident(row.original);
              setShowDetailsModal(true);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.original.images && row.original.images.length > 0 && (
            <button
              onClick={() => {
                setSelectedIncident(row.original);
                setShowDetailsModal(true);
              }}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
              title="View Images"
            >
              <FileImage className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // Filter functions
  const getFilteredIncidents = (status) => {
    return incidents.filter(incident => incident.status === status);
  };

  const stats = {
    total: filteredIncidents.length,
    resolved: filteredIncidents.filter(i => i.status === 'Resolved').length,
    pending: filteredIncidents.filter(i => i.status === 'Pending').length,
    underReview: filteredIncidents.filter(i => i.status === 'Under Review').length,
    underInvestigation: filteredIncidents.filter(i => i.status === 'Under Investigation').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Incident History</h1>
            <p className="text-gray-600">
              View and track all your reported incidents
            </p>
          </div>
          <button
            onClick={exportIncidents}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-md">
              <Hourglass className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.underReview}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-orange-100 text-orange-700 rounded-md">
              <SearchCheck className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.underInvestigation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <SearchCheck className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">All Incidents</h2>
          <p className="text-gray-600">Complete history of your incident reports</p>
        </div>

        {filteredIncidents.length > 0 ? (
          <DataTable
            data={filteredIncidents}
            columns={incidentColumns}
            searchPlaceholder=""
            showSearch={false}
            pageSize={10}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">
              <BarChart3 className="inline w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
            <p className="text-gray-600 mb-4">
              You haven't reported any incidents yet.
            </p>
            <a
              href="/user/new-incident"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Report Your First Incident
            </a>
          </div>
        )}
      </div>

      {/* Status Legend */}
      {incidents.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-100 rounded-full mr-2"></span>
              <span className="text-gray-600">Resolved - Incident has been handled</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-100 rounded-full mr-2"></span>
              <span className="text-gray-600">Under Review - Being evaluated</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-orange-100 rounded-full mr-2"></span>
              <span className="text-gray-600">Under Investigation - Active review</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-blue-100 rounded-full mr-2"></span>
              <span className="text-gray-600">Pending - Awaiting review</span>
            </div>
          </div>
        </div>
      )}

      {/* Incident Details Modal */}
      {showDetailsModal && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Incident Details - {selectedIncident.incidentType}
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedIncident(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Incident Type</label>
                  <p className="text-sm text-gray-900">{selectedIncident.incidentType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                  <p className="text-sm text-gray-900">{selectedIncident.vehicleNumber}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedIncident.location}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="text-sm text-gray-900">{selectedIncident.date} at {selectedIncident.time}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedIncident.severity === 'High' ? 'bg-red-100 text-red-800' :
                    selectedIncident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedIncident.severity}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedIncident.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    selectedIncident.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                    selectedIncident.status === 'Under Investigation' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedIncident.status}
                  </span>
                </div>
                
                {selectedIncident.approvedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approved By</label>
                    <p className="text-sm text-gray-900">{selectedIncident.approvedBy}</p>
                  </div>
                )}
                
                {selectedIncident.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                    <p className="text-sm text-gray-900">{selectedIncident.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-900">{selectedIncident.description}</p>
              </div>
            </div>

            {selectedIncident.additionalNotes && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-900">{selectedIncident.additionalNotes}</p>
                </div>
              </div>
            )}

            {selectedIncident.images && selectedIncident.images.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attached Images ({selectedIncident.images.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedIncident.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedIncident(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentHistory;
