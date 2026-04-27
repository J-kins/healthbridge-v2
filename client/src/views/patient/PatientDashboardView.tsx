import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/shared/Icon';

const PatientDashboardView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-purple rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.first_name}!
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
          <p className="text-3xl font-bold text-neutral-900">2</p>
          <Link to="/patient/appointments" className="text-primary-600 font-semibold text-sm mt-4 inline-block hover:text-primary-700">
            View All →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all">
          <div className="text-primary-600 mb-4"><Icon name="heart" size={32} /></div>
          <p className="text-neutral-600 text-sm mb-2">Saved Clinics</p>
          <p className="text-3xl font-bold text-neutral-900">5</p>
          <Link to="/patient/saved-clinics" className="text-primary-600 font-semibold text-sm mt-4 inline-block hover:text-primary-700">
            View All →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all">
          <div className="text-primary-600 mb-4"><Icon name="star" size={32} /></div>
          <p className="text-neutral-600 text-sm mb-2">Reviews Written</p>
          <p className="text-3xl font-bold text-neutral-900">3</p>
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

        <div className="space-y-4">
          {[
            {
              clinic: 'City Health Clinic',
              doctor: 'Dr. Sarah Johnson',
              date: 'Dec 15, 2024',
              time: '2:00 PM',
              type: 'General Checkup'
            },
            {
              clinic: 'Downtown Medical Center',
              doctor: 'Dr. Michael Chen',
              date: 'Dec 22, 2024',
              time: '10:30 AM',
              type: 'Dental Consultation'
            }
          ].map((apt, idx) => (
            <div key={idx} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">{apt.clinic}</h3>
                  <p className="text-neutral-600 text-sm mb-2">{apt.doctor} • {apt.type}</p>
                  <div className="flex items-center gap-4 text-sm text-neutral-700">
                    <span className="flex items-center gap-1"><Icon name="calendar" size={14} /> {apt.date}</span>
                    <span className="flex items-center gap-1"><Icon name="clock" size={14} /> {apt.time}</span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors font-semibold">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Profile */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Your Health Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-neutral-600 text-sm">Blood Type</label>
              <p className="font-semibold text-neutral-900">O+</p>
            </div>
            <div>
              <label className="text-neutral-600 text-sm">Allergies</label>
              <p className="font-semibold text-neutral-900">Penicillin, Nuts</p>
            </div>
            <div>
              <label className="text-neutral-600 text-sm">Chronic Conditions</label>
              <p className="font-semibold text-neutral-900">None</p>
            </div>
            <button className="w-full mt-6 py-2 px-4 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Recent Reviews</h2>
          
          <div className="space-y-4">
            {[
              { clinic: 'City Health Clinic', rating: 5, date: 'Dec 8, 2024' },
              { clinic: 'Downtown Medical Center', rating: 4, date: 'Nov 28, 2024' }
            ].map((review, idx) => (
              <div key={idx} className="border-t border-neutral-200 pt-4 first:border-t-0 first:pt-0">
                <p className="font-semibold text-neutral-900">{review.clinic}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5 text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="star" size={14} />
                    ))}
                  </div>
                  <span className="text-neutral-600 text-sm">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardView;
