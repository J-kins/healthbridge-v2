import React from 'react';
import Icon from '../../components/shared/Icon';

const PatientSavedClinicsView: React.FC = () => {
  const savedClinics = [
    {
      id: 1,
      name: 'City Health Clinic',
      address: '123 Main St, Downtown',
      rating: 4.8,
      reviews: 142,
      distance: '0.5 km away',
      hours: '8:00 AM - 8:00 PM',
      specialties: ['General Practice', 'Cardiology', 'Dermatology'],
      image: 'hospital'
    },
    {
      id: 2,
      name: 'Downtown Medical Center',
      address: '456 Park Ave, City Center',
      rating: 4.9,
      reviews: 287,
      distance: '1.2 km away',
      hours: '7:00 AM - 9:00 PM',
      specialties: ['Emergency Care', 'Surgery', 'Orthopedics'],
      image: 'hospital'
    },
    {
      id: 3,
      name: 'Wellness Clinic',
      address: '789 Oak Ln, Suburb',
      rating: 4.6,
      reviews: 98,
      distance: '2.1 km away',
      hours: '9:00 AM - 5:00 PM',
      specialties: ['Family Medicine', 'Pediatrics', 'Vaccinations'],
      image: 'hospital'
    },
    {
      id: 4,
      name: 'Sports Medicine Center',
      address: '321 Pine Rd, North District',
      rating: 4.7,
      reviews: 164,
      distance: '1.8 km away',
      hours: '8:30 AM - 6:30 PM',
      specialties: ['Physical Therapy', 'Sports Medicine', 'Rehabilitation'],
      image: 'hospital'
    },
    {
      id: 5,
      name: 'Eye Care Specialists',
      address: '654 Elm St, East Side',
      rating: 4.9,
      reviews: 203,
      distance: '2.5 km away',
      hours: '10:00 AM - 7:00 PM',
      specialties: ['Ophthalmology', 'Optometry', 'Eye Surgery'],
      image: 'eye'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Saved Clinics</h1>
        <p className="text-neutral-600">Your favorite clinics for quick access and easy booking</p>
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search clinics..."
          className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>All Specialties</option>
          <option>General Practice</option>
          <option>Cardiology</option>
          <option>Orthopedics</option>
        </select>
        <select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>Sort by: Rating</option>
          <option>Distance</option>
          <option>Recently Added</option>
        </select>
      </div>

      {/* Clinics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {savedClinics.map((clinic) => (
          <div
            key={clinic.id}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Clinic Header Image */}
            <div className="h-48 bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center relative">
              <div className="text-white">
                <Icon name={clinic.image as any} size={64} />
              </div>
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform text-primary-600 shadow-md">
                <Icon name="heart" size={20} />
              </button>
            </div>

            {/* Clinic Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-1">{clinic.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <Icon name="star" size={16} className="text-yellow-400" />
                <span className="font-semibold text-neutral-900">{clinic.rating}</span>
                <span className="text-neutral-600 text-sm">({clinic.reviews} reviews)</span>
              </div>

              {/* Address & Distance */}
              <div className="space-y-2 mb-4 text-sm text-neutral-600">
                <p className="flex items-center gap-2"><Icon name="map-pin" size={14} /> {clinic.address}</p>
                <p className="flex items-center gap-2"><Icon name="navigation" size={14} /> {clinic.distance}</p>
                <p className="flex items-center gap-2"><Icon name="clock" size={14} /> {clinic.hours}</p>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-neutral-600 mb-2">SPECIALTIES</p>
                <div className="flex flex-wrap gap-2">
                  {clinic.specialties.map((spec, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-2 px-4 rounded-lg bg-gradient-purple text-white font-semibold hover:shadow-lg transition-all">
                  Book Now
                </button>
                <button className="flex-1 py-2 px-4 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no clinics) */}
      {savedClinics.length === 0 && (
        <div className="bg-neutral-50 rounded-xl border border-dashed border-neutral-300 p-12 text-center">
          <div className="text-primary-600 mb-4 flex justify-center">
            <Icon name="heart" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">No Saved Clinics Yet</h2>
          <p className="text-neutral-600 mb-6">
            Start exploring clinics and save your favorites for easy access
          </p>
          <button className="px-8 py-3 rounded-lg bg-gradient-purple text-white font-semibold hover:shadow-lg transition-all">
            Discover Clinics
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientSavedClinicsView;
