// src/ComponentEmergencyServices/ServiceComponents/AmbulanceServices.jsx
import { useState, useEffect } from 'react';
import { FaAmbulance, FaMapMarkerAlt, FaClock, FaPhoneAlt, FaUser, FaNotesMedical, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
const AmbulanceServices = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    emergencyType: 'accident',
    additionalInfo: ''
  });

  // Get user's current location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLoadingLocation(false);
        }, error => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          setError('Location access denied. Please enter your address manually.');
        });
      } else {
        setError('Geolocation is not supported by your browser.');
      }
    };
    if (currentStep === 1) {
      getUserLocation();
    }
  }, [currentStep]);
  const ambulanceTypes = [{
    id: 'basic',
    name: 'Basic Life Support',
    description: 'For non-critical emergencies',
    responseTime: '8-12 min',
    icon: <FaAmbulance className="text-blue-500" />
  }, {
    id: 'advanced',
    name: 'Advanced Life Support',
    description: 'For critical emergencies with paramedic',
    responseTime: '6-10 min',
    icon: <FaAmbulance className="text-red-500" />
  }, {
    id: 'neonatal',
    name: 'Neonatal Ambulance',
    description: 'Specialized for infants and newborns',
    responseTime: '10-15 min',
    icon: <FaAmbulance className="text-pink-500" />
  }, {
    id: 'cardiac',
    name: 'Cardiac Care Ambulance',
    description: 'Equipped for heart emergencies',
    responseTime: '7-12 min',
    icon: <FaAmbulance className="text-purple-500" />
  }];
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError(null); // Clear error on input change
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    // Basic validation - include emergencyType
    if (!formData.name || !formData.phone || !formData.location || !formData.emergencyType) {
      setError('Please fill in all required fields');
      return;
    }

    // Phone validation
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian phone number');
      return;
    }

    // Only after validations pass, show processing screen
    setCurrentStep(3);
    let response;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated. Please login again.');
      }

      // FIX: Normalize emergencyType case to match backend enum
      const formatEmergencyType = type => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('accident')) return 'Accident';
        if (lowerType.includes('heart')) return 'Heart Attack';
        if (lowerType.includes('stroke')) return 'Stroke';
        return 'Other';
      };
      const payload = {
        patientName: formData.name,
        emergencyType: formatEmergencyType(formData.emergencyType),
        // Normalized value
        contactNumber: cleanPhone,
        address: formData.location,
        additionalInfo: formData.additionalInfo
      };

      // Send request to backend
      response = await fetch('/api/ambulance/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // Handle response
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};
      if (!response.ok) {
        if (data.errors) {
          const errorMsg = Object.values(data.errors).join(', ');
          throw new Error(errorMsg);
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      // Save request details
      setRequestDetails({
        ...data,
        estimatedArrival: data.estimatedTime || '15-20 minutes',
        ambulanceType: 'Advanced Life Support',
        ambulanceId: data.ambulanceId || `AMB-${Math.floor(100 + Math.random() * 900)}`
      });
      setIsSubmitted(true);
      setCurrentStep(4);
    } catch (err) {
      console.error('Ambulance request error:', err);
      if (err.message.includes('401') || response && response.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err instanceof SyntaxError) {
        setError('Invalid response from server. Please try again.');
      } else {
        setError(err.message || 'Failed to request ambulance. Please try again.');
      }
      setCurrentStep(2);
    }
  };
  const handleNextStep = () => {
    // Validate step 1 before proceeding
    if (currentStep === 1) {
      if (!formData.name || !formData.phone || !formData.location) {
        setError('Please fill in all required fields');
        return;
      }
      setError(null);
    }
    setCurrentStep(currentStep + 1);
  };
  const handleNewRequest = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setRequestDetails(null);
    setError(null);
    setFormData({
      name: '',
      phone: '',
      location: '',
      emergencyType: 'accident',
      additionalInfo: ''
    });
  };

  // Map emergency type to display name
  const getEmergencyTypeName = type => {
    const types = {
      accident: 'Accident',
      heart: 'Heart Attack',
      stroke: 'Stroke',
      other: 'Other'
    };
    return types[type] || type;
  };
  return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-red-100 text-red-800 p-3 rounded-full mb-4">
          <FaAmbulance className="text-2xl mr-2" />
          <h1 className="text-3xl font-bold">Emergency Ambulance Services</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Immediate ambulance dispatch with paramedics and life-saving equipment
        </p>
      </div>

      {/* Error Message Banner */}
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
        <div className="flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      </div>}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Ambulance Request Form */}
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
                <span className="mt-2 text-sm font-medium">
                  {step === 1 && 'Details'}
                  {step === 2 && 'Confirm'}
                  {step === 3 && 'Processing'}
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
              {currentStep === 1 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Information</h2>
                <p className="text-gray-600 mb-6">Please provide details about the emergency</p>
                      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaUser className="mr-2 text-red-600" /> Full Name *
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter patient's full name" required />
                  </div>
                        
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaPhoneAlt className="mr-2 text-red-600" /> Phone Number *
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter contact number" required />
                  </div>
                </div>
                      
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-600" /> Location *
                  </label>
                  <div className="flex items-center mb-2">
                    {isLoadingLocation ? <span className="text-sm text-blue-600">
                      Detecting your location...
                      </span> : userLocation ? <span className="text-sm text-green-600">
                        Location detected! (Accuracy: ~50m)
                      </span> : <span className="text-sm text-yellow-600">
                        Enter your address manually
                      </span>}
                  </div>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter exact location or address" required />
                </div>
                      
                <div>
                  <label className="block text-gray-700 mb-2">Emergency Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[{
                      value: 'accident',
                      label: 'Accident'
                    }, {
                      value: 'heart',
                      label: 'Heart Attack'
                    }, {
                      value: 'stroke',
                      label: 'Stroke'
                    }, {
                      value: 'other',
                      label: 'Other'
                    }].map(type => <label key={type.value} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.emergencyType === type.value ? 'border-red-500 bg-red-50 text-red-700 font-medium' : 'border-gray-300 hover:border-red-300'}`}>
                      <input type="radio" name="emergencyType" value={type.value} checked={formData.emergencyType === type.value} onChange={handleInputChange} className="sr-only" />
                      {type.label}
                    </label>)}
                  </div>
                </div>
                      
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center">
                    <FaNotesMedical className="mr-2 text-red-600" /> Additional Information
                  </label>
                  <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Describe the emergency, number of patients, etc." rows="3"></textarea>
                </div>
                      
                <button type="button" onClick={handleNextStep} className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors mt-4" disabled={isLoadingLocation}>
                  {isLoadingLocation ? 'Detecting Location...' : 'Continue to Confirm'}
                </button>
                </div>}
                  
              {currentStep === 2 && <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Request</h2>
                <p className="text-gray-600 mb-6">Please verify the information before submitting</p>
                      
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-1/3 font-medium text-gray-700">Name:</div>
                      <div className="w-2/3">{formData.name}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium text-gray-700">Phone:</div>
                      <div className="w-2/3">{formData.phone}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium text-gray-700">Location:</div>
                      <div className="w-2/3">{formData.location}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium text-gray-700">Emergency Type:</div>
                      <div className="w-2/3">{getEmergencyTypeName(formData.emergencyType)}</div>
                    </div>
                    {formData.additionalInfo && <div className="flex">
                      <div className="w-1/3 font-medium text-gray-700">Additional Info:</div>
                      <div className="w-2/3">{formData.additionalInfo}</div>
                    </div>}
                  </div>
                </div>
                      
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                    Edit Details
                  </button>
                  <button type="submit" className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition-colors">
                    Request Ambulance Now
                  </button>
                </div>
                </div>}
                  
              {currentStep === 3 && <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Your Request</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're dispatching the nearest available ambulance to your location. 
                  Please stay on the line and keep the patient stable.
                </p>
                </div>}
            </form> : <div className="text-center py-8">
              <div className="inline-flex items-center justify-center bg-green-100 text-green-800 p-4 rounded-full mb-6">
                <FaCheckCircle className="text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ambulance Request Confirmed!</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {requestDetails ? <>
                  Ambulance <span className="font-bold">{requestDetails.ambulanceId}</span> has been dispatched. 
                  Estimated arrival: <span className="font-bold">{requestDetails.estimatedArrival}</span>.
                </> : "Your ambulance request has been received successfully!"}
              </p>
                  
              {requestDetails && <div className="bg-green-50 rounded-xl p-6 border border-green-200 max-w-md mx-auto mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Request ID:</span>
                    <span>{requestDetails.requestId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ambulance ID:</span>
                    <span>{requestDetails.ambulanceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{requestDetails.ambulanceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ETA:</span>
                    <span className="font-bold text-red-600">{requestDetails.estimatedArrival}</span>
                  </div>
                </div>
                </div>}
                  
              <div className="space-y-3 max-w-md mx-auto">
                <p className="font-medium">What to do next:</p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Stay on the line with our operator</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Clear the pathway for ambulance access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Keep the patient calm and stable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Gather patient's medical history if available</span>
                  </li>
                </ul>
              </div>
                  
              <button onClick={handleNewRequest} className="mt-8 bg-red-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-red-700 transition-colors">
                Request Another Ambulance
              </button>
            </div>}
          </div>
        </div>
          
        {/* Right Column - Ambulance Information */}
        <div className="space-y-8">
          {/* Available Ambulances */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaAmbulance className="text-red-600 mr-2" /> Available Ambulances
            </h2>
            <p className="text-gray-600 mb-4">Nearest to your location</p>
              
            <div className="space-y-4">
              {ambulanceTypes.map(ambulance => <div key={ambulance.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="mr-3 text-2xl">
                    {ambulance.icon}
                  </div>
                  <h3 className="font-bold text-gray-800">{ambulance.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">{ambulance.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1" />
                  <span>Avg. response: {ambulance.responseTime}</span>
                </div>
              </div>)}
            </div>
          </div>
            
          {/* Emergency Instructions */}
          <div className="bg-red-50 rounded-2xl shadow-xl p-6 border border-red-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Emergency Instructions</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Stay calm and ensure the area is safe</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Do not move the patient unless absolutely necessary</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Perform basic first aid if trained</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Keep emergency medications accessible</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span>Clear pathways for ambulance access</span>
              </li>
            </ul>
          </div>
            
          {/* Emergency Contact */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-3">Need Immediate Help?</h2>
            <p className="mb-4">Call our emergency helpline for direct assistance</p>
            <a href="tel:+917003697337" className="flex items-center justify-center bg-white text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              <FaPhoneAlt className="mr-2" /> Call: +91 700 369 7337
            </a>
          </div>
        </div>
      </div>
        
      {/* Ambulance Tracking Map (Placeholder) */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ambulance Tracking</h2>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-red-600" />
            <p className="text-lg">Live ambulance tracking will appear here</p>
            <p className="text-sm mt-2">Once an ambulance is dispatched, you can track its location in real-time</p>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default AmbulanceServices;
