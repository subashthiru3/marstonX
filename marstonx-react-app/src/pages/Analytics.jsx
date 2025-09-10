import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockIncidents, mockVehicles, mockUsers } from '../data/mockData';
// import { 
//   BarChart, 
//   Bar, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Area,
//   AreaChart
// } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  AlertTriangle,
  Car,
  Users,
  Calendar,
  Filter
} from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    generateAnalyticsData();
  }, [timeRange]);

  const generateAnalyticsData = () => {
    // Calculate date range based on selection
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Filter incidents by date range
    const filteredIncidents = mockIncidents.filter(incident => {
      const incidentDate = new Date(incident.date);
      return incidentDate >= startDate && incidentDate <= endDate;
    });

    // Generate daily incident data
    const dailyData = generateDailyData(startDate, endDate, filteredIncidents);
    
    // Generate incident type distribution
    const incidentTypeData = generateIncidentTypeData(filteredIncidents);
    
    // Generate severity distribution
    const severityData = generateSeverityData(filteredIncidents);
    
    // Generate status distribution
    const statusData = generateStatusData(filteredIncidents);
    
    // Generate vehicle incident data
    const vehicleData = generateVehicleData(filteredIncidents);
    
    // Generate user activity data
    const userActivityData = generateUserActivityData(filteredIncidents);

    setAnalyticsData({
      dailyData,
      incidentTypeData,
      severityData,
      statusData,
      vehicleData,
      userActivityData,
      totalIncidents: filteredIncidents.length,
      resolvedIncidents: filteredIncidents.filter(i => i.status === 'Resolved').length,
      pendingIncidents: filteredIncidents.filter(i => i.status === 'Pending' || i.status === 'Under Review').length,
      highSeverityIncidents: filteredIncidents.filter(i => i.severity === 'High').length,
    });
  };

  const generateDailyData = (startDate, endDate, incidents) => {
    const data = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayIncidents = incidents.filter(incident => incident.date === dateStr);
      
      data.push({
        date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: dayIncidents.length,
        resolved: dayIncidents.filter(i => i.status === 'Resolved').length,
        pending: dayIncidents.filter(i => i.status === 'Pending' || i.status === 'Under Review').length,
        high: dayIncidents.filter(i => i.severity === 'High').length,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const generateIncidentTypeData = (incidents) => {
    const typeCount = {};
    incidents.forEach(incident => {
      typeCount[incident.incidentType] = (typeCount[incident.incidentType] || 0) + 1;
    });
    
    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / incidents.length) * 100).toFixed(1)
    }));
  };

  const generateSeverityData = (incidents) => {
    const severityCount = {};
    incidents.forEach(incident => {
      severityCount[incident.severity] = (severityCount[incident.severity] || 0) + 1;
    });
    
    return Object.entries(severityCount).map(([severity, count]) => ({
      severity,
      count,
      fill: severity === 'High' ? '#ef4444' : severity === 'Medium' ? '#f59e0b' : '#10b981'
    }));
  };

  const generateStatusData = (incidents) => {
    const statusCount = {};
    incidents.forEach(incident => {
      statusCount[incident.status] = (statusCount[incident.status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      fill: status === 'Resolved' ? '#10b981' : 
            status === 'Under Review' ? '#f59e0b' : 
            status === 'Under Investigation' ? '#f97316' : '#3b82f6'
    }));
  };

  const generateVehicleData = (incidents) => {
    const vehicleCount = {};
    incidents.forEach(incident => {
      vehicleCount[incident.vehicleNumber] = (vehicleCount[incident.vehicleNumber] || 0) + 1;
    });
    
    return Object.entries(vehicleCount)
      .map(([vehicle, count]) => ({ vehicle, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 vehicles
  };

  const generateUserActivityData = (incidents) => {
    const userCount = {};
    incidents.forEach(incident => {
      userCount[incident.userName] = (userCount[incident.userName] || 0) + 1;
    });
    
    return Object.entries(userCount)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 users
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">
              Comprehensive insights into fleet incidents and trends
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalIncidents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-green-100 text-green-700 rounded-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.resolvedIncidents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-md">
              <Activity className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.pendingIncidents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.highSeverityIncidents || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Incidents Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.dailyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="total" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div> */}

        {/* Incident Types Distribution */}
        {/* <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.incidentTypeData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(analyticsData.incidentTypeData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div> */}

        {/* Severity Distribution */}
        {/* <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.severityData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* Status Distribution */}
        {/* <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.statusData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(analyticsData.statusData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div> */}
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vehicles by Incidents */}
        {/* <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vehicles by Incidents</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.vehicleData || []} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="vehicle" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* Top Users by Activity */}
        {/* <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Users by Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.userActivityData || []} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="user" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analyticsData.totalIncidents > 0 ? 
                ((analyticsData.resolvedIncidents / analyticsData.totalIncidents) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analyticsData.totalIncidents > 0 ? 
                (analyticsData.totalIncidents / 30).toFixed(1) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg. Incidents/Day</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {analyticsData.highSeverityIncidents > 0 ? 
                ((analyticsData.highSeverityIncidents / analyticsData.totalIncidents) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">High Priority Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
