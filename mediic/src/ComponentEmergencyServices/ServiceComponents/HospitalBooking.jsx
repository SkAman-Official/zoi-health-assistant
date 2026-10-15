// src/ComponentEmergencyServices/ServiceComponents/HospitalBooking.jsx
import { useState } from 'react';
import { FaHospital, FaUser, FaPhoneAlt, FaNotesMedical, FaMapMarkerAlt, FaBed, FaHeartbeat, FaClock, FaCheckCircle, FaAmbulance } from 'react-icons/fa';
const HospitalBooking = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    condition: 'emergency',
    symptoms: '',
    hospitalId: '',
    ambulanceRequired: false
  });
  const hospitals = [{
    id: 'apollo',
    name: 'Apollo Hospital',
    distance: '2.5 km',
    bedsAvailable: 12,
    specialties: ['Cardiology', 'Neurology', 'Trauma'],
    waitTime: '15 min',
    contact: '+91 33 2320 3040'
  }, {
    id: 'amri',
    name: 'AMRI Hospital',
    distance: '3.8 km',
    bedsAvailable: 8,
    specialties: ['Oncology', 'Orthopedics', 'Pediatrics'],
    waitTime: '25 min',
    contact: '+91 33 6680 0000'
  }, {
    id: 'fortis',
    name: 'Fortis Hospital',
    distance: '5.2 km',
    bedsAvailable: 5,
    specialties: ['Cardiac Surgery', 'Nephrology', 'ICU'],
    waitTime: '40 min',
    contact: '+91 33 6628 4444'
  }, {
    id: 'cmri',
    name: 'CMRI Hospital',
    distance: '4.1 km',
    bedsAvailable: 15,
    specialties: ['General Surgery', 'ENT', 'Dermatology'],
    waitTime: '10 min',
    contact: '+91 33 3989 8989'
  }];
  const handleInputChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send authentication token
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Simulate form submission
        setTimeout(() => {
          setIsSubmitted(true);
          setCurrentStep(5);
        }, 1500);
      } else {
        console.error('Booking submission failed');
        // Handle error (show message to user)
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      // Handle network error
    }
  };
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  const handleNewBooking = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      name: '',
      phone: '',
      condition: 'emergency',
      symptoms: '',
      hospitalId: '',
      ambulanceRequired: false
    });
  };
  const selectedHospital = hospitals.find(h => h.id === formData.hospitalId);
  return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 p-3 rounded-full mb-4">
          <FaHospital className="text-2xl mr-2" />
          <h1 className="text-3xl font-bold">Emergency Hospital Booking</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Secure immediate hospital admission and priority care
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Hospital Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            {/* Step Indicator */}
            <div className="flex justify-between mb-8 relative">
              {[1, 2, 3, 4, 5].map(step => <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {currentStep > step ? <FaCheckCircle /> : step}
                </div>
                <span className="mt-2 text-sm font-medium text-center">
                  {step === 1 && 'Patient'}
                  {step === 2 && 'Condition'}
                  {step === 3 && 'Hospital'}
                  {step === 4 && 'Confirm'}
                  {step === 5 && 'Complete'}
                </span>
              </div>)}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-1">
                <div
                  className="h-1 bg-blue-600 transition-all duration-500"
                  style={{
                  width: `${(currentStep - 1) * 25}%`
                }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            {!isSubmitted ? <form onSubmit={handleSubmit}>
              {/* Step 1: Patient Information */}
              {currentStep === 1 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Information</h2>
                <p className="text-gray-600 mb-6">Please provide basic details about the patient</p>
                      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaUser className="mr-2 text-blue-600" /> Full Name
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter patient's full name" required />
                  </div>
                        
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaPhoneAlt className="mr-2 text-blue-600" /> Phone Number
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter contact number" required />
                  </div>
                </div>
                      
                <button type="button" onClick={handleNextStep} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors mt-4">
                  Continue to Medical Condition
                </button>
                </div>}
                  
              {/* Step 2: Medical Condition */}
              {currentStep === 2 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Medical Condition</h2>
                <p className="text-gray-600 mb-6">Describe the patient's condition</p>
                      
                <div>
                  <label className="block text-gray-700 mb-2">Condition Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[{
                      value: 'emergency',
                      label: 'Emergency'
                    }, {
                      value: 'critical',
                      label: 'Critical'
                    }, {
                      value: 'urgent',
                      label: 'Urgent Care'
                    }, {
                      value: 'other',
                      label: 'Other'
                    }].map(type => <label key={type.value} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.condition === type.value ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-300 hover:border-blue-300'}`}>
                      <input type="radio" name="condition" value={type.value} checked={formData.condition === type.value} onChange={handleInputChange} className="sr-only" required />
                      {type.label}
                    </label>)}
                  </div>
                </div>
                      
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center">
                    <FaNotesMedical className="mr-2 text-blue-600" /> Symptoms
                  </label>
                  <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe the symptoms, duration, and severity" rows="3" required></textarea>
                </div>
                      
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={handlePrevStep} className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={handleNextStep} className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Continue to Hospital Selection
                  </button>
                </div>
                </div>}
                  
              {/* Step 3: Hospital Selection */}
              {currentStep === 3 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Hospital</h2>
                <p className="text-gray-600 mb-6">Choose the most appropriate hospital based on availability and specialty</p>
                      
                <div className="space-y-4">
                  {hospitals.map(hospital => <label key={hospital.id} className={`block border rounded-xl p-5 cursor-pointer transition-all ${formData.hospitalId === hospital.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="hospitalId" value={hospital.id} checked={formData.hospitalId === hospital.id} onChange={handleInputChange} className="mt-1 mr-3" required />
                      <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-800">{hospital.name}</h3>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                              {hospital.distance}
                            </span>
                          </div>
                                
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              <FaBed className="mr-1 text-blue-600" />
                              {hospital.bedsAvailable} beds available
                            </span>
                            <span className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              <FaClock className="mr-1 text-blue-600" />
                              Wait: {hospital.waitTime}
                            </span>
                          </div>
                                
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Specialties:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {hospital.specialties.map((spec, idx) => <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {spec}
                              </span>)}
                            </div>
                          </div>
                                
                          <div className="mt-3 flex items-center text-sm">
                            <FaPhoneAlt className="text-blue-600 mr-1" />
                            <span>{hospital.contact}</span>
                          </div>
                        </div>
                    </div>
                  </label>)}
                </div>
                      
                <div className="mt-6 flex items-center">
                  <input type="checkbox" name="ambulanceRequired" checked={formData.ambulanceRequired} onChange={handleInputChange} id="ambulanceCheckbox" className="mr-3" />
                  <label htmlFor="ambulanceCheckbox" className="text-gray-700">
                    <span className="font-medium">Request ambulance transfer</span> (if patient needs transportation)
                  </label>
                </div>
                      
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={handlePrevStep} className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={handleNextStep} className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Continue to Confirmation
                  </button>
                </div>
                </div>}
                  
              {/* Step 4: Confirmation */}
              {currentStep === 4 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Hospital Booking</h2>
                <p className="text-gray-600 mb-6">Please verify all details before submitting</p>
                      
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Name</div>
                      <div className="font-medium">{formData.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{formData.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Condition</div>
                      <div className="font-medium capitalize">{formData.condition}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Ambulance Requested</div>
                      <div className="font-medium">{formData.ambulanceRequired ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                        
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">Symptoms</div>
                    <div className="font-medium">{formData.symptoms}</div>
                  </div>
                </div>
                      
                  {selectedHospital && <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mt-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Hospital Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Hospital</div>
                        <div className="font-medium">{selectedHospital.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Distance</div>
                        <div className="font-medium">{selectedHospital.distance}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Beds Available</div>
                        <div className="font-medium">{selectedHospital.bedsAvailable}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Estimated Wait</div>
                        <div className="font-medium">{selectedHospital.waitTime}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Contact</div>
                        <div className="font-medium">{selectedHospital.contact}</div>
                      </div>
                    </div>
                  </div>}
                      
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setCurrentStep(3)} className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                    Edit Details
                  </button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Confirm Hospital Booking
                  </button>
                </div>
                </div>}
                  
              {/* Step 5: Processing */}
              {currentStep === 5 && !isSubmitted && <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Your Booking</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're securing your hospital bed and preparing for your arrival. 
                  Please gather the patient's medical records if available.
                </p>
                </div>}
            </form> : (/* Completion Screen */
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center bg-green-100 text-green-800 p-4 rounded-full mb-6">
                  <FaCheckCircle className="text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital Booking Confirmed!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  A bed has been reserved at <span className="font-bold">{selectedHospital?.name}</span>. 
                  Please proceed directly to the emergency department.
                </p>
                  
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 max-w-md mx-auto mb-8">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Hospital:</span>
                        <span className="font-medium">{selectedHospital?.name}</span>
                      </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Reference ID:</span>
                        <span className="font-medium">HOS-2023-7584</span>
                      </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Patient:</span>
                        <span className="font-medium">{formData.name}</span>
                      </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Arrival Time:</span>
                        <span className="font-medium">Within 45 minutes</span>
                      </div>
                    {formData.ambulanceRequired && <div className="flex justify-between">
                        <span className="text-gray-600">Ambulance:</span>
                        <span className="font-medium">Dispatched (ETA 12 min)</span>
                        </div>}
                    <div className="flex justify-between mt-3 pt-3 border-t border-green-200">
                        <span className="text-gray-600 font-medium">Contact:</span>
                        <span className="font-bold text-blue-600">{selectedHospital?.contact}</span>
                      </div>
                  </div>
                </div>
                  
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">What to do next:</h3>
                    <ul className="text-left text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Proceed directly to <span className="font-medium">{selectedHospital?.name}</span></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Ask for the Emergency Department at reception</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Provide reference ID: <span className="font-mono">HOS-2023-7584</span></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Bring any medical records or medications</span>
                        </li>
                      </ul>
                  </div>
                    
                  <button onClick={handleNewBooking} className="mt-6 bg-blue-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Book Another Hospital
                    </button>
                </div>
              </div>)}
          </div>
        </div>
          
        {/* Right Column - Hospital Information */}
        <div className="space-y-8">
          {/* Hospital Availability Map */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="text-blue-600 mr-2" /> Hospital Availability
            </h2>
              
            <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
              {/* Simplified map representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50"></div>
                
              {/* Hospital markers */}
              {hospitals.map((hospital, index) => <div
                key={hospital.id}
                className="absolute bg-white rounded-full p-2 shadow-md flex items-center justify-center border-2 border-blue-500"
                style={{
                left: `${20 + index * 20}%`,
                top: `${30 + (index % 2 === 0 ? -10 : 10)}%`,
                transform: 'translate(-50%, -50%)'
              }}
              >
                <FaHospital className="text-blue-600" />
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {hospital.bedsAvailable}
                </div>
              </div>)}
                
              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white p-2 rounded-lg shadow-sm text-xs">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Hospital with available beds</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span>No availability</span>
                </div>
              </div>
            </div>
              
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing hospitals within 5km radius
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                View Full Map
              </button>
            </div>
          </div>
            
          {/* Hospital Specialties */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hospital Specialties</h2>
              
            <div className="space-y-4">
              {[{
                name: 'Cardiology',
                hospitals: ['Apollo', 'Fortis'],
                icon: <FaHeartbeat className="text-red-500" />
              }, {
                name: 'Trauma Care',
                hospitals: ['Apollo', 'CMRI'],
                icon: <FaAmbulance className="text-orange-500" />
              }, {
                name: 'Pediatrics',
                hospitals: ['AMRI', 'CMRI'],
                icon: <FaUser className="text-green-500" />
              }, {
                name: 'Orthopedics',
                hospitals: ['AMRI', 'Fortis'],
                icon: <FaBed className="text-blue-500" />
              }].map((specialty, index) => <div key={index} className="flex items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="mr-3 text-xl">
                  {specialty.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{specialty.name}</div>
                  <div className="text-sm text-gray-600">Available at: {specialty.hospitals.join(', ')}</div>
                </div>
              </div>)}
            </div>
          </div>
            
          {/* Emergency Contact */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-3">Need Assistance?</h2>
            <p className="mb-4">Contact our emergency coordination center</p>
            <a href="tel:+917003697337" className="flex items-center justify-center bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              <FaPhoneAlt className="mr-2" /> Call: +91 700 369 7337
            </a>
          </div>
        </div>
      </div>
        
      {/* Hospital Directions (Placeholder) */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital Directions</h2>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-blue-600" />
            <p className="text-lg">Directions to selected hospital will appear here</p>
            <p className="text-sm mt-2">After confirming a booking, you'll get turn-by-turn navigation</p>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default HospitalBooking;
