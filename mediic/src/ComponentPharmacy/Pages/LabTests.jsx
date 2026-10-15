// src/pages/LabTests.jsx
import { useState } from 'react';
const LabTests = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTest, setExpandedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const categories = ['All', 'Blood Tests', 'Imaging', 'Urine Tests', 'Wellness', 'Specialized'];
  const tests = [{
    id: 1,
    name: "Complete Blood Count",
    price: 50,
    category: "Blood Tests",
    description: "Measures different components of your blood",
    details: "Includes red and white blood cell count, hemoglobin, hematocrit, and platelet count. Results available in 24-48 hours.",
    preparation: "Fasting not required",
    popular: true
  }, {
    id: 2,
    name: "Urinalysis",
    price: 30,
    category: "Urine Tests",
    description: "Comprehensive urine examination",
    details: "Tests for pH, protein, glucose, ketones, bilirubin, and microscopic examination. Screens for kidney disease, diabetes, and urinary infections.",
    preparation: "First morning urine sample preferred"
  }, {
    id: 3,
    name: "Chest X-Ray",
    price: 100,
    category: "Imaging",
    description: "Basic chest imaging examination",
    details: "Standard two-view chest radiograph. Screens for lung conditions, heart size abnormalities, and chest anatomy.",
    preparation: "Remove jewelry and metal objects"
  }, {
    id: 4,
    name: "MRI Scan (Full Body)",
    price: 1000,
    category: "Imaging",
    description: "Detailed imaging of body structures",
    details: "Comprehensive magnetic resonance imaging of all body regions. Provides detailed images of soft tissues, organs, and bones without radiation.",
    preparation: "No metal objects, may require contrast injection",
    popular: true
  }, {
    id: 5,
    name: "Thyroid Panel",
    price: 80,
    category: "Blood Tests",
    description: "Thyroid function assessment",
    details: "Measures TSH, T3, T4, and free T4 levels. Evaluates thyroid function and screens for disorders like hypothyroidism and hyperthyroidism.",
    preparation: "Fasting not required"
  }, {
    id: 6,
    name: "Vitamin D Test",
    price: 65,
    category: "Wellness",
    description: "Vitamin D levels measurement",
    details: "25-hydroxy vitamin D test to determine deficiency. Essential for bone health, immune function, and overall wellbeing.",
    preparation: "Fasting not required"
  }, {
    id: 7,
    name: "ECG / EKG",
    price: 75,
    category: "Specialized",
    description: "Heart electrical activity test",
    details: "12-lead electrocardiogram measuring heart's electrical activity. Detects arrhythmias, heart attacks, and other cardiac conditions.",
    preparation: "Avoid lotions or oils on chest"
  }, {
    id: 8,
    name: "Allergy Panel",
    price: 150,
    category: "Blood Tests",
    description: "Comprehensive allergy screening",
    details: "Tests for reactions to 40 common allergens including pollen, dust, foods, and pet dander. Results include severity levels.",
    preparation: "No antihistamines 72 hours prior"
  }];
  const filteredTests = tests.filter(test => {
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) || test.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const toggleExpand = id => {
    setExpandedTest(expandedTest === id ? null : id);
  };
  return <div className="max-w-6xl mx-auto px-4 py-8">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 mb-10 text-center shadow-xl animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-3">Laboratory Tests</h1>
      <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
        Comprehensive, accurate testing with fast results. Book your tests online with instant access to reports.
      </p>
    </div>

    {/* Search and Filter Section */}
    <div className="mb-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input type="text" placeholder="Search tests..." className="w-full p-4 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow">
          Book Appointment
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          {category}
        </button>)}
      </div>
    </div>

    {/* Test Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {filteredTests.length > 0 ? filteredTests.map(test => <div key={test.id} className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border-l-4 ${test.popular ? 'border-indigo-500' : 'border-white'}`}>
        {test.popular && <div className="bg-indigo-500 text-white text-xs font-bold px-4 py-1 text-center">
          POPULAR TEST
          </div>}
              
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{test.name}</h3>
              <span className="text-gray-500 text-sm">{test.category}</span>
            </div>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
              ${test.price}
            </span>
          </div>
                
          <p className="text-gray-600 mb-4">{test.description}</p>
                
          <div className="flex justify-between items-center">
            <button onClick={() => toggleExpand(test.id)} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              {expandedTest === test.id ? 'Show Less' : 'Details & Preparation'} 
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform ${expandedTest === test.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
                  
            <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Add to Cart
            </button>
          </div>
                
          {expandedTest === test.id && <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            <h4 className="font-bold text-gray-800 mb-2">Test Details:</h4>
            <p className="text-gray-600 mb-4">{test.details}</p>
                    
            <h4 className="font-bold text-gray-800 mb-2">Preparation:</h4>
            <p className="text-gray-600">{test.preparation}</p>
            </div>}
        </div>
      </div>) : <div className="col-span-full text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-700">No tests found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
      </div>}
    </div>

    {/* Additional Info Section */}
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-indigo-100">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Fast & Accurate Results</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Digital reports delivered within 24-48 hours</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Certified labs with precision equipment</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Expert analysis by medical professionals</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Need help choosing?</h3>
          <p className="text-gray-600 mb-4">Our medical team can recommend the right tests for your needs</p>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors">
            Consult a Specialist
          </button>
        </div>
      </div>
    </div>
  </div>;
};
export default LabTests;
