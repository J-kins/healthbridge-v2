import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import Icon from '../../components/shared/Icon';

type TabType = 'upcoming' | 'completed' | 'cancelled';

const PatientAppointmentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointments = await patientService.getAppointments();
        setAllAppointments(appointments || []);
      } catch (err: any) {
        console.error('Failed to fetch appointments:', err);
        setError(err.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filterAppointmentsByStatus = (status: TabType) => {
    const statusMap = {
      upcoming: ['scheduled', 'confirmed'],
      completed: ['completed'],
      cancelled: ['cancelled']
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allAppointments.filter(apt => {
      const appointmentDate = new Date(apt.appointment_date);
      const isUpcoming = appointmentDate >= today;
      
      if (status === 'upcoming') {
        return statusMap.upcoming.includes(apt.status) && isUpcoming;
      }
      return statusMap[status].includes(apt.status);
    });
  };

  const tabs: { value: TabType; label: string; icon: any }[] = [
    { value: 'upcoming', label: 'Upcoming', icon: 'calendar' },
    { value: 'completed', label: 'Completed', icon: 'check' },
    { value: 'cancelled', label: 'Cancelled', icon: 'x-mark' }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading appointments...</p></div>;
  }

  const filteredAppointments = filterAppointmentsByStatus(activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Your Appointments</h1>
        <p className="text-neutral-600">Manage and track all your medical appointments</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-neutral-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-6 py-4 font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.value
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Icon name={tab.icon} size={18} className="inline-block align-text-bottom mr-2" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Appointment Details */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                      {apt.clinic_name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-900">{apt.clinic_name || 'Clinic'}</h3>
                      <p className="text-neutral-600 text-sm mb-2">{apt.service_name || 'General Consultation'}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                        <span className="flex items-center gap-1"><Icon name="calendar" size={14} /> {new Date(apt.appointment_date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Icon name="clock" size={14} /> {apt.appointment_time}</span>
                        {apt.duration_minutes && <span className="flex items-center gap-1"><Icon name="hospital" size={14} /> {apt.duration_minutes} min</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </div>

                  <div className="flex gap-2">
                    {(apt.status === 'confirmed' || apt.status === 'scheduled') && (
                      <>
                        <button className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors font-semibold text-sm">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors font-semibold text-sm">
                          Cancel
                        </button>
                      </>
                    )}
                    {apt.status === 'completed' && (
                      <button className="px-4 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors font-semibold text-sm">
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-neutral-50 rounded-xl border border-dashed border-neutral-300 p-12 text-center">
            <p className="text-neutral-600 text-lg">No {activeTab} appointments</p>
            <button 
              onClick={() => navigate('/search')}
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-purple text-white font-semibold hover:shadow-lg transition-all"
            >
              Book an Appointment
            </button>
          </div>
        )}
      </div>

      {/* Book New Appointment CTA */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Need a Doctor?</h2>
        <p className="text-neutral-600 mb-6">Find and book appointments at verified clinics in your area</p>
        <button 
          onClick={() => navigate('/search')}
          className="px-8 py-3 rounded-lg bg-gradient-purple text-white font-semibold hover:shadow-lg transition-all"
        >
          Find Clinics
        </button>
      </div>
    </div>
  );
};

export default PatientAppointmentsView;
