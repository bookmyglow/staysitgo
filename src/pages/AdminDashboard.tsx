import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api, API_ENDPOINTS } from '../lib/api';
import { Users, List, Clock, CheckCircle, AlertCircle, TrendingUp, Mail, MessageSquare, Settings, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
  pendingVerifications: number;
  recentBookings: any[];
  recentUsers: any[];
  subscriptionStats: any[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  subscription: any;
  _count: {
    parentListings: number;
    sitterListings: number;
    bookingsAsParent: number;
    bookingsAsSitter: number;
  };
}

interface Verification {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'users' | 'verifications' | 'listings' | 'subscriptions' | 'support'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchVerifications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
      if (response.success && response.data.dashboard) {
        setStats(response.data.dashboard);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
      if (response.success && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchVerifications = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.VERIFICATIONS);
      if (response.success && response.data.verifications) {
        setVerifications(response.data.verifications);
      }
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    }
  };

  const verifyDocument = async (id: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    try {
      const response = await api.put(`/admin/verifications/${id}`, { status, reviewNotes: notes });
      if (response.success) {
        fetchVerifications();
      }
    } catch (error) {
      console.error('Failed to update verification:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Listings</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalListings || 0}</p>
            </div>
            <List className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingVerifications || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$0</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          {stats?.recentBookings?.length ? (
            <div className="space-y-3">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {booking.parent.firstName} → {booking.sitter.firstName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent bookings</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          {stats?.recentUsers?.length ? (
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="border-b pb-3 flex justify-between">
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent users</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">User Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    P: {user._count.parentListings} | S: {user._count.sitterListings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    As Parent: {user._count.bookingsAsParent} | As Sitter: {user._count.bookingsAsSitter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {/* Handle user actions */}}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVerifications = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">ID Verification Queue</h3>
        <div className="space-y-4">
          {verifications.map((verification) => (
            <div key={verification.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {verification.user.firstName} {verification.user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{verification.user.email}</p>
                  <p className="text-sm text-gray-500">Role: {verification.user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => verifyDocument(verification.id, 'APPROVED')}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => verifyDocument(verification.id, 'REJECTED', 'Document unclear')}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {/* View documents */}}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform management and monitoring</p>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'verifications', icon: CheckCircle, label: 'Verifications' },
              { id: 'listings', icon: List, label: 'Listings' },
              { id: 'subscriptions', icon: DollarSign, label: 'Subscriptions' },
              { id: 'support', icon: MessageSquare, label: 'Support' },
            ].map((tab: any) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {selectedTab === 'dashboard' && renderDashboard()}
            {selectedTab === 'users' && renderUsers()}
            {selectedTab === 'verifications' && renderVerifications()}
            {selectedTab === 'listings' && <div>Listings view</div>}
            {selectedTab === 'subscriptions' && <div>Subscriptions view</div>}
            {selectedTab === 'support' && <div>Support view</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;