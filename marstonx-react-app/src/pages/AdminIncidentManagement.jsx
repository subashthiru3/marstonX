import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import { mockIncidents, getSavedIncidents, updateIncident } from '../data/mockData';
import { 
  TriangleAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Edit,
  MessageSquare,
  User,
  Car,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';

const AdminIncidentManagement = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    filterIncidents();
  }, [incidents, searchTerm, statusFilter, severityFilter, typeFilter]);

  const loadIncidents = () => {
    try {
      // Combine mock incidents with saved incidents
      const savedIncidents = getSavedIncidents() || [];
      const allIncidents = [...mockIncidents, ...savedIncidents]
        .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
      
      setIncidents(allIncidents);
    } catch (error) {
      console.error('Error loading incidents:', error);
      setIncidents(mockIncidents);
    } finally {
      setLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = incidents;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    setFilteredIncidents(filtered);
  };

  const handleStatusUpdate = (incidentId, newStatus, notes = '') => {
    const updatedIncident = updateIncident(incidentId, {
      status: newStatus,
      approvedBy: user.name,
      notes: notes,
      updatedAt: new Date().toISOString()
    });

    if (updatedIncident) {
      setIncidents(incidents.map(incident => 
        incident.id === incidentId ? updatedIncident : incident
      ));
    }
  };

  const getUniqueTypes = () => {
    return [...new Set(incidents.map(i => i.incidentType))];
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
      accessorKey: 'userName',
      header: 'Reported By',
      cell: ({ getValue }) => (
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'vehicleNumber',
      header: 'Vehicle',
      cell: ({ getValue }) => (
        <div className="flex items-center">
          <Car className="w-4 h-4 text-gray-400 mr-2" />
          <span className="font-medium text-blue-600">{getValue()}</span>
        </div>
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
        <div className="flex items-center max-w-xs">
          <MapPin className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
          <span className="truncate" title={getValue()}>{getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date & Time',
      cell: ({ getValue, row }) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <div className="text-sm">
            <div className="font-medium">{getValue()}</div>
            <div className="text-gray-500">{row.original.time}</div>
          </div>
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
          <button
            onClick={() => {
              setSelectedIncident(row.original);
              setShowUpdateModal(true);
            }}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
            title="Update Status"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Incident Management</h1>
            <p className="text-gray-600">
              Review, approve, and manage all fleet incident reports
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-md">
              <TriangleAlert className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-semibold text-gray-900">{incidents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-md">
              <Clock className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {incidents.filter(i => i.status === 'Pending' || i.status === 'Under Review').length}
              </p>
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
              <p className="text-2xl font-semibold text-gray-900">
                {incidents.filter(i => i.status === 'Resolved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-md">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">
                {incidents.filter(i => i.severity === 'High').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
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
            <AlertCircle className="w-5 h-5 text-gray-400" />
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
            <TriangleAlert className="w-5 h-5 text-gray-400" />
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

          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <DataTable
          data={filteredIncidents}
          columns={incidentColumns}
          searchPlaceholder=""
          showSearch={false}
          pageSize={10}
        />
      </div>

      {/* Incident Details Modal */}
      {showDetailsModal && selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedIncident(null);
          }}
        />
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedIncident && (
        <UpdateStatusModal
          incident={selectedIncident}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedIncident(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

// Incident Details Modal Component
const IncidentDetailsModal = ({ incident, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Incident Details - {incident.incidentType}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Incident Type</label>
              <p className="text-sm text-gray-900">{incident.incidentType}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Reported By</label>
              <p className="text-sm text-gray-900">{incident.userName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle</label>
              <p className="text-sm text-gray-900">{incident.vehicleNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <p className="text-sm text-gray-900">{incident.location}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <p className="text-sm text-gray-900">{incident.date} at {incident.time}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                incident.severity === 'High' ? 'bg-red-100 text-red-800' :
                incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {incident.severity}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                incident.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                incident.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                incident.status === 'Under Investigation' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {incident.status}
              </span>
            </div>
            
            {incident.approvedBy && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Approved By</label>
                <p className="text-sm text-gray-900">{incident.approvedBy}</p>
              </div>
            )}
            
            {incident.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                <p className="text-sm text-gray-900">{incident.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-900">{incident.description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Update Status Modal Component
const UpdateStatusModal = ({ incident, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(incident.status);
  const [notes, setNotes] = useState(incident.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(incident.id, newStatus, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Incident Status</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Incident</label>
            <p className="text-sm text-gray-900">{incident.incidentType} - {incident.vehicleNumber}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
            <p className="text-sm text-gray-600">{incident.status}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this incident..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminIncidentManagement;
