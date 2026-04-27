import React, { useState } from 'react';
import Icon from '../../components/shared/Icon';

type TabType = 'upcoming' | 'completed' | 'cancelled';

const PatientAppointmentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const appointments = {
    upcoming: [
      {
        id: 1,
        clinic: 'City Health Clinic',
        doctor: 'Dr. Sarah Johnson',
        date: 'Dec 15, 2024',
        time: '2:00 PM',
        type: 'General Checkup',
        status: 'Confirmed'
      },
      {
        id: 2,
        clinic: 'Downtown Medical Center',
        doctor: 'Dr. Michael Chen',
        date: 'Dec 22, 2024',
        time: '10:30 AM',
        type: 'Dental Consultation',
        status: 'Scheduled'
      }
    ],
    completed: [
      {
        id: 3,
        clinic: 'Wellness Clinic',
        doctor: 'Dr. Emily White',
        date: 'Nov 30, 2024',
        time: '3:00 PM',
        type: 'Eye Checkup',
        status: 'Completed'
      }
    ],
    cancelled: [
      {
        id: 4,
        clinic: 'Sports Medicine Center',
        doctor: 'Dr. James Smith',
        date: 'Nov 15, 2024',
        time: '11:00 AM',
        type: 'Physical Therapy',
        status: 'Cancelled'
      }
    ]
  };

  const tabs: { value: TabType; label: string; icon: any }[] = [
    { value: 'upcoming', label: 'Upcoming', icon: 'calendar' },
    { value: 'completed', label: 'Completed', icon: 'check' },
    { value: 'cancelled', label: 'Cancelled', icon: 'x-mark' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Your Appointments</h1>
        <p className="text-neutral-600">Manage and track all your medical appointments</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-6 py-4 font-semibold transition-all border-b-2 ${
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
        {appointments[activeTab].length > 0 ? (
          appointments[activeTab].map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Appointment Details */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                      {apt.doctor.charAt(4)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-900">{apt.clinic}</h3>
                      <p className="text-neutral-600 text-sm mb-2">{apt.doctor}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                        <span className="flex items-center gap-1"><Icon name="calendar" size={14} /> {apt.date}</span>
                        <span className="flex items-center gap-1"><Icon name="clock" size={14} /> {apt.time}</span>
                        <span className="flex items-center gap-1"><Icon name="hospital" size={14} /> {apt.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    apt.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : apt.status === 'Scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : apt.status === 'Completed'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {apt.status}
                  </div>

                  <div className="flex gap-2">
                    {(apt.status === 'Confirmed' || apt.status === 'Scheduled') && (
                      <>
                        <button className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors font-semibold text-sm">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors font-semibold text-sm">
                          Cancel
                        </button>
                      </>
                    )}
                    {apt.status === 'Completed' && (
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
            <button className="mt-4 px-6 py-2 rounded-lg bg-gradient-purple text-white font-semibold hover:shadow-lg transition-all">
              Book an Appointment
            </button>
          </div>
        )}
      </div>

      {/* Book New Appointment CTA */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Need a Doctor?</h2>
        <p className="text-neutral-600 mb-6">Find and book appointments at verified clinics in your area</p>
        <button className="px-8 py-3 rounded-lg bg-gradient-purple text-white font-semibold hover:shadow-lg transition-all">
          Find Clinics
        </button>
      </div>
    </div>
  );
};

export default PatientAppointmentsView;
