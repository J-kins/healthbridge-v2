import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { patientService } from '../../services/patientService';
import Icon from '../../components/shared/Icon';

interface DashboardData {
  user: any;
  stats: {
    upcomingAppointments: number;
    savedClinics: number;
    reviewsWritten: number;
  };
  appointments: any[];
  savedClinics: any[];
}

const PatientDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await patientService.getDashboard();
        setData(response);
      } catch (err: any) {
        console.error('Failed to fetch dashboard:', err);
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-purple rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {data?.user?.first_name || user?.first_name}!
        </h1>
        <p className="text-primary-100 text-lg">
          Manage your appointments and health records in one place
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all">
          <div className="text-primary-600 mb-4"><Icon name="calendar" size={32} /></div>
          <p className="text-neutral-600 text-sm mb-2">Upcoming Appointments</p>
          <p className="text-3xl font-bold text-neutral-900">{data?.stats.upcomingAppointments || 0}</p>
          <Link to="/patient/appointments" className="text-primary-600 font-semibold text-sm mt-4 inline-block hover:text-primary-700">
            View All →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all">
          <div className="text-primary-600 mb-4"><Icon name="heart" size={32} /></div>
          <p className="text-neutral-600 text-sm mb-2">Saved Clinics</p>
          <p className="text-3xl font-bold text-neutral-900">{data?.stats.savedClinics || 0}</p>
          <Link to="/patient/saved-clinics" className="text-primary-600 font-semibold text-sm mt-4 inline-block hover:text-primary-700">
            View All →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all">
          <div className="text-primary-600 mb-4"><Icon name="star" size={32} /></div>
          <p className="text-neutral-600 text-sm mb-2">Reviews Written</p>
          <p className="text-3xl font-bold text-neutral-900">{data?.stats.reviewsWritten || 0}</p>
          <a href="#" className="text-primary-600 font-semibold text-sm mt-4 inline-block hover:text-primary-700">
            Write Review →
          </a>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-primary-600 font-semibold hover:text-primary-700">
            View All →
          </Link>
        </div>

        {data?.appointments && data.appointments.length > 0 ? (
          <div className="space-y-4">
            {data.appointments.map((apt: any) => (
              <div key={apt.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">{apt.clinic_name || 'Clinic'}</h3>
                    <p className="text-neutral-600 text-sm mb-2">{apt.service_name ? apt.service_name + ' • ' : ''}General Consultation</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-700">
                      <span className="flex items-center gap-1"><Icon name="calendar" size={14} /> {new Date(apt.appointment_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Icon name="clock" size={14} /> {apt.appointment_time}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors font-semibold">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-600">No upcoming appointments</p>
        )}
      </div>

      {/* Health Profile */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Your Health Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-neutral-600 text-sm">Name</label>
              <p className="font-semibold text-neutral-900">{data?.user?.first_name} {data?.user?.last_name}</p>
            </div>
            <div>
              <label className="text-neutral-600 text-sm">Email</label>
              <p className="font-semibold text-neutral-900">{data?.user?.email}</p>
            </div>
            <div>
              <label className="text-neutral-600 text-sm">Phone</label>
              <p className="font-semibold text-neutral-900">{data?.user?.phone || 'Not provided'}</p>
            </div>
            <Link to="/patient/profile" className="w-full inline-block text-center py-2 px-4 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Saved Clinics</h2>
          
          {data?.savedClinics && data.savedClinics.length > 0 ? (
            <div className="space-y-4">
              {data.savedClinics.slice(0, 3).map((clinic: any) => (
                <div key={clinic.id} className="border-t border-neutral-200 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-semibold text-neutral-900">{clinic.name}</p>
                  <p className="text-neutral-600 text-sm">{clinic.city}</p>
                  {clinic.avg_rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-0.5 text-yellow-400">
                        {[...Array(Math.round(clinic.avg_rating))].map((_, i) => (
                          <Icon key={i} name="star" size={14} />
                        ))}
                      </div>
                      <span className="text-neutral-600 text-sm">{clinic.avg_rating?.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600">No saved clinics yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardView;
