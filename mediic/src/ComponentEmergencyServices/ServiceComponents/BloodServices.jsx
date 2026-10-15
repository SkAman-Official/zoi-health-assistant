// src/ComponentEmergencyServices/ServiceComponents/BloodServices.jsx
import { useState } from 'react';
import { FaTint, FaUser, FaPhoneAlt, FaNotesMedical, FaHospital, FaClock, FaCheckCircle, FaHeartbeat } from 'react-icons/fa';
const BloodServices = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    contactName: '',
    phone: '',
    bloodType: 'O+',
    units: '1',
    urgency: 'critical',
    hospital: '',
    additionalInfo: ''
  });
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const hospitals = [{
    id: 'apollo',
    name: 'Apollo Hospital',
    distance: '2.5 km',
    contact: '+91 33 2320 3040'
  }, {
    id: 'amri',
    name: 'AMRI Hospital',
    distance: '3.8 km',
    contact: '+91 33 6680 0000'
  }, {
    id: 'fortis',
    name: 'Fortis Hospital',
    distance: '5.2 km',
    contact: '+91 33 6628 4444'
  }, {
    id: 'redcross',
    name: 'Red Cross Blood Bank',
    distance: '4.1 km',
    contact: '+91 33 2247 0505'
  }];
  const bloodAvailability = {
    'A+': {
      available: 15,
      critical: false
    },
    'A-': {
      available: 5,
      critical: true
    },
    'B+': {
      available: 22,
      critical: false
    },
    'B-': {
      available: 3,
      critical: true
    },
    'AB+': {
      available: 8,
      critical: false
    },
    'AB-': {
      available: 1,
      critical: true
    },
    'O+': {
      available: 18,
      critical: false
    },
    'O-': {
      available: 2,
      critical: true
    }
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated. Please login again.');
      }

      // Prepare payload
      const payload = {
        patientName: formData.patientName,
        contactName: formData.contactName,
        phone: formData.phone,
        bloodType: formData.bloodType,
        units: formData.units,
        urgency: formData.urgency,
        hospital: formData.hospital,
        additionalInfo: formData.additionalInfo
      };
      console.log('Submitting payload:', payload); // Add this for debugging

      // Send request to backend
      const response = await fetch('/api/blood-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // Handle 401 specifically
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please login again.');
      }

      // Handle all non-200 responses
      if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        try {
          // Attempt to get error details from response
          const errorText = await response.text();
          errorMessage += `: ${errorText}`;
        } catch (parseError) {
          errorMessage += ' (Failed to parse error details)';
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setIsSubmitted(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Booking error:', error);

      // Enhanced error handling
      let displayMessage = error.message || 'Failed to book blood service. Please try again.';

      // Specific handling for backend model errors
      if (displayMessage.includes('BloodBooking')) {
        displayMessage = 'Internal server error. Our team has been notified. Please try again later.';
        console.error('Server-side configuration error detected:', error.message);
      } else if (displayMessage.includes('401') || displayMessage.includes('Session expired')) {
        // Already handled
      } else if (error instanceof SyntaxError) {
        displayMessage = 'Invalid server response. Please try again.';
      } else if (displayMessage.includes('status 400')) {
        displayMessage = 'Invalid request. Please check your input and try again.';
      }
      setError(displayMessage);
      setCurrentStep(2);
    }
  };
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  const handleNewRequest = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      patientName: '',
      contactName: '',
      phone: '',
      bloodType: 'O+',
      units: '1',
      urgency: 'critical',
      hospital: '',
      additionalInfo: ''
    });
  };
  const selectedHospital = hospitals.find(h => h.id === formData.hospital);
  const bloodStatus = bloodAvailability[formData.bloodType];
  return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-red-50 py-12 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-red-100 text-red-800 p-3 rounded-full mb-4">
          <FaTint className="text-2xl mr-2" />
          <h1 className="text-3xl font-bold">Emergency Blood Services</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with blood donors and blood banks during critical emergencies
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Blood Request Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            {/* Step Indicator */}
            <div className="flex justify-between mb-8 relative">
              {[1, 2, 3, 4].map(step => <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {currentStep > step ? <FaCheckCircle /> : step}
                </div>
                <span className="mt-2 text-sm font-medium text-center">
                  {step === 1 && 'Patient'}
                  {step === 2 && 'Blood'}
                  {step === 3 && 'Confirm'}
                  {step === 4 && 'Complete'}
                </span>
              </div>)}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-1">
                <div
                  className="h-1 bg-red-600 transition-all duration-500"
                  style={{
                  width: `${(currentStep - 1) * 33.33}%`
                }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            {!isSubmitted ? <form onSubmit={handleSubmit}>
              {/* Step 1: Patient Information */}
              {currentStep === 1 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Information</h2>
                <p className="text-gray-600 mb-6">Please provide details about the patient</p>
                      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaUser className="mr-2 text-red-600" /> Patient Name
                    </label>
                    <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter patient's full name" required />
                  </div>
                        
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaUser className="mr-2 text-red-600" /> Contact Person
                    </label>
                    <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Your name" required />
                  </div>
                </div>
                      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaPhoneAlt className="mr-2 text-red-600" /> Phone Number
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter contact number" required />
                  </div>
                        
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaHospital className="mr-2 text-red-600" /> Hospital
                    </label>
                    <select name="hospital" value={formData.hospital} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
                      <option value="">Select Hospital</option>
                      {hospitals.map(hospital => <option key={hospital.id} value={hospital.id}>
                          {hospital.name} ({hospital.distance})
                        </option>)}
                    </select>
                  </div>
                </div>
                      
                <button type="button" onClick={handleNextStep} className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors mt-4">
                  Continue to Blood Details
                </button>
                </div>}
                  
              {/* Step 2: Blood Details */}
              {currentStep === 2 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Blood Requirements</h2>
                <p className="text-gray-600 mb-6">Specify the blood type and quantity needed</p>
                      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Blood Type</label>
                    <div className="grid grid-cols-4 gap-3">
                      {bloodTypes.map(type => <label key={type} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.bloodType === type ? 'border-red-500 bg-red-50 text-red-700 font-medium' : 'border-gray-300 hover:border-red-300'} ${bloodAvailability[type].critical ? 'bg-red-100 animate-pulse' : ''}`}>
                          <input type="radio" name="bloodType" value={type} checked={formData.bloodType === type} onChange={handleInputChange} className="sr-only" required />
                          {type}
                        </label>)}
                    </div>
                          
                    <div className="mt-3 text-sm">
                      {bloodStatus.critical ? <div className="text-red-600 font-medium flex items-center">
                          <FaHeartbeat className="mr-2" /> 
                          Critical shortage! Only {bloodStatus.available} units available
                        </div> : <div className="text-green-600">
                          {bloodStatus.available} units available
                        </div>}
                    </div>
                  </div>
                        
                  <div>
                    <label className="block text-gray-700 mb-2">Units Required</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['1', '2', '3', '4', '5', '6+'].map(unit => <label key={unit} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.units === unit ? 'border-red-500 bg-red-50 text-red-700 font-medium' : 'border-gray-300 hover:border-red-300'}`}>
                          <input type="radio" name="units" value={unit} checked={formData.units === unit} onChange={handleInputChange} className="sr-only" required />
                          {unit} {unit === '1' ? 'unit' : 'units'}
                        </label>)}
                    </div>
                  </div>
                </div>
                      
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Urgency Level</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[{
                      value: 'critical',
                      label: 'Critical (Immediate)'
                    }, {
                      value: 'urgent',
                      label: 'Urgent (<4 hours)'
                    }, {
                      value: 'standard',
                      label: 'Standard (24 hours)'
                    }].map(urgency => <label key={urgency.value} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all text-center ${formData.urgency === urgency.value ? 'border-red-500 bg-red-50 text-red-700 font-medium' : 'border-gray-300 hover:border-red-300'}`}>
                      <input type="radio" name="urgency" value={urgency.value} checked={formData.urgency === urgency.value} onChange={handleInputChange} className="sr-only" required />
                      {urgency.label}
                    </label>)}
                  </div>
                </div>
                      
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2 flex items-center">
                    <FaNotesMedical className="mr-2 text-red-600" /> Additional Information
                  </label>
                  <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Provide any additional details (diagnosis, special requirements, etc.)" rows="3"></textarea>
                </div>
                      
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={handlePrevStep} className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={handleNextStep} className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition-colors">
                    Continue to Confirmation
                  </button>
                </div>
                </div>}
                  
              {/* Step 3: Confirmation */}
              {currentStep === 3 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Blood Request</h2>
                <p className="text-gray-600 mb-6">Please verify all details before submitting</p>
                      
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Patient Name</div>
                      <div className="font-medium">{formData.patientName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Contact Person</div>
                      <div className="font-medium">{formData.contactName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{formData.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Hospital</div>
                      <div className="font-medium">{selectedHospital?.name}</div>
                    </div>
                  </div>
                </div>
                      
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Blood Request Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Blood Type</div>
                      <div className="font-medium">
                          <span className={`px-2 py-1 rounded ${bloodStatus.critical ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {formData.bloodType}
                          </span>
                        </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Units Required</div>
                      <div className="font-medium">{formData.units} units</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Urgency</div>
                      <div className="font-medium capitalize">{formData.urgency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Availability</div>
                      <div className={`font-medium ${bloodStatus.critical ? 'text-red-600' : 'text-green-600'}`}>
                          {bloodStatus.available} units available
                        </div>
                    </div>
                  </div>
                        
                  {formData.additionalInfo && <div className="mt-4">
                    <div className="text-sm text-gray-600">Additional Information</div>
                    <div className="font-medium">{formData.additionalInfo}</div>
                  </div>}
                </div>
                      
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={handlePrevStep} className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                    Edit Details
                  </button>
                  <button type="submit" className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition-colors">
                    Submit Blood Request
                  </button>
                </div>
                </div>}
                  
              {/* Step 4: Processing */}
              {currentStep === 4 && !isSubmitted && <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Your Request</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're connecting with blood banks and donors to fulfill your request. 
                  Please stay near the hospital for delivery.
                </p>
                </div>}
            </form> : (/* Completion Screen */
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center bg-green-100 text-green-800 p-4 rounded-full mb-6">
                  <FaCheckCircle className="text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Blood Request Confirmed!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We've located {formData.units} unit(s) of {formData.bloodType} blood and 
                  it's being prepared for delivery to <span className="font-bold">{selectedHospital?.name}</span>.
                </p>
                  
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 max-w-md mx-auto mb-8">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Request Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Request ID:</span>
                        <span className="font-medium">BLOOD-2023-8452</span>
                      </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Blood Type:</span>
                        <span className="font-medium">{formData.bloodType}</span>
                      </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Units:</span>
                        <span className="font-medium">{formData.units}</span>
                      </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Hospital:</span>
                        <span className="font-medium">{selectedHospital?.name}</span>
                      </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Delivery:</span>
                        <span className="font-bold text-red-600">
                          {formData.urgency === 'critical' ? 'Within 45 minutes' : formData.urgency === 'urgent' ? 'Within 3 hours' : 'Within 24 hours'}
                        </span>
                      </div>
                    <div className="flex justify-between mt-3 pt-3 border-t border-green-200">
                        <span className="text-gray-600 font-medium">Contact:</span>
                        <span className="font-bold text-red-600">{selectedHospital?.contact}</span>
                      </div>
                  </div>
                </div>
                  
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">What to do next:</h3>
                    <ul className="text-left text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Proceed to {selectedHospital?.name} immediately</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Inform the blood bank about request ID: <span className="font-mono">BLOOD-2023-8452</span></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Keep the patient hydrated and stable</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Have patient identification ready</span>
                        </li>
                      </ul>
                  </div>
                    
                  <button onClick={handleNewRequest} className="mt-6 bg-red-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-red-700 transition-colors">
                    Make Another Request
                    </button>
                </div>
              </div>)}
          </div>
        </div>
          
        {/* Right Column - Blood Information */}
        <div className="space-y-8">
          {/* Blood Availability */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaTint className="text-red-600 mr-2" /> Blood Availability
            </h2>
              
            <div className="grid grid-cols-4 gap-3">
              {bloodTypes.map(type => <div key={type} className={`border rounded-lg p-3 text-center transition-all ${bloodAvailability[type].critical ? 'border-red-500 bg-red-50 text-red-800 animate-pulse' : 'border-gray-200 hover:border-red-300'}`}>
                <div className="text-lg font-bold">{type}</div>
                <div className={`text-sm ${bloodAvailability[type].critical ? 'font-bold' : ''}`}>
                  {bloodAvailability[type].available} units
                </div>
              </div>)}
            </div>
              
            <div className="mt-4 flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Critical shortage (less than 5 units)</span>
            </div>
          </div>
            
          {/* Blood Banks */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nearby Blood Banks</h2>
              
            <div className="space-y-4">
              {[{
                name: 'Red Cross Blood Bank',
                distance: '4.1 km',
                available: true
              }, {
                name: 'Lions Blood Bank',
                distance: '5.7 km',
                available: true
              }, {
                name: 'Rotary Blood Center',
                distance: '6.3 km',
                available: false
              }, {
                name: 'Government Blood Bank',
                distance: '7.2 km',
                available: true
              }].map((bank, index) => <div key={index} className={`border rounded-lg p-4 transition-all ${bank.available ? 'border-green-200 hover:border-green-300' : 'border-gray-200 opacity-70'}`}>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{bank.name}</h3>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {bank.distance}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <FaTint className={`mr-1 ${bank.available ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={bank.available ? 'text-green-600' : 'text-gray-500'}>
                    {bank.available ? 'Open now' : 'Closed - opens at 9 AM'}
                  </span>
                </div>
              </div>)}
            </div>
          </div>
            
          {/* Donation Information */}
          <div className="bg-red-50 rounded-2xl shadow-xl p-6 border border-red-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Become a Blood Donor</h2>
            <p className="text-gray-600 mb-4">Your donation can save lives. Register as a blood donor today.</p>
              
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 p-2 rounded-full mr-3">
                  <FaUser className="text-sm" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Eligibility</h3>
                  <p className="text-sm text-gray-600">Age 18-65, weight greater-than 50kg, good health</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 p-2 rounded-full mr-3">
                  <FaClock className="text-sm" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Process</h3>
                  <p className="text-sm text-gray-600">Takes about 1 hour, including screening</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 p-2 rounded-full mr-3">
                  <FaHeartbeat className="text-sm" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Benefits</h3>
                  <p className="text-sm text-gray-600">Free health checkup, saves lives</p>
                </div>
              </div>
            </div>
              
            <button className="w-full bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors mt-4">
              Register as Donor
            </button>
          </div>
            
          {/* Emergency Contact */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-3">Blood Emergency?</h2>
            <p className="mb-4">Call our blood coordination center</p>
            <a href="tel:+917003697337" className="flex items-center justify-center bg-white text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              <FaPhoneAlt className="mr-2" /> Call: +91 700 369 7337
            </a>
          </div>
        </div>
      </div>
        
      {/* Blood Donation Information */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blood Donation Information</h2>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <FaHeartbeat className="text-red-600 mr-2" /> Why Donate Blood?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>One donation can save up to 3 lives</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Blood cannot be manufactured - it only comes from donors</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Regular donation reduces risk of heart disease</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Helps maintain healthy iron levels in your body</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Free health screening with each donation</span>
              </li>
            </ul>
          </div>
            
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <FaClock className="text-red-600 mr-2" /> Donation Process
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Registration</h4>
                  <p className="text-sm text-gray-600">Complete donor registration form</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Health Screening</h4>
                  <p className="text-sm text-gray-600">Quick health check and iron test</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Donation</h4>
                  <p className="text-sm text-gray-600">Actual blood donation (10-15 minutes)</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Refreshments</h4>
                  <p className="text-sm text-gray-600">Recover with snacks and drinks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default BloodServices;
