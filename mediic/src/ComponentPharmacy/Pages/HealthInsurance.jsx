// src/pages/HealthInsurance.jsx
import { useState, useEffect } from 'react';
const HealthInsurance = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedPlans, setComparedPlans] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [animateHeader, setAnimateHeader] = useState(false);
  useEffect(() => {
    // Trigger header animation after component mounts
    setAnimateHeader(true);
  }, []);
  const plans = [{
    id: 1,
    name: "Basic Plan",
    price: 100,
    description: "Essential coverage for individuals",
    features: ["Primary care visits: $30 copay", "Generic drugs: $10 copay", "Annual deductible: $1,500", "Preventive care covered"],
    popular: false
  }, {
    id: 2,
    name: "Premium Plan",
    price: 200,
    description: "Comprehensive coverage with lower out-of-pocket",
    features: ["Primary care visits: $20 copay", "Specialist visits: $40 copay", "Annual deductible: $500", "Emergency room: $150 copay", "Mental health services included"],
    popular: true
  }, {
    id: 3,
    name: "Family Plan",
    price: 300,
    description: "Complete protection for your entire family",
    features: ["Children's dental & vision", "Maternity care included", "Annual deductible: $1,000", "24/7 telehealth services", "Wellness program benefits"],
    popular: false
  }];
  const toggleComparison = planId => {
    if (comparedPlans.includes(planId)) {
      setComparedPlans(comparedPlans.filter(id => id !== planId));
    } else {
      if (comparedPlans.length < 2) {
        setComparedPlans([...comparedPlans, planId]);
      }
    }
  };
  const toggleDetails = planId => {
    setShowDetails(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };
  const selectPlanForComparison = planId => {
    if (comparisonMode) {
      toggleComparison(planId);
    } else {
      setSelectedPlan(selectedPlan === planId ? null : planId);
    }
  };
  return <div className="max-w-6xl mx-auto px-4 py-8">
    {/* Animated Header */}
    <div
      className={`
        bg-gradient-to-r from-blue-500 to-indigo-600 
        rounded-2xl p-8 mb-12 text-center
        shadow-xl transform transition-all duration-700
        ${animateHeader ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}
    >
      <h1 className="text-4xl font-bold text-white mb-4">Health Insurance Plans</h1>
      <p className="text-xl text-blue-100 max-w-2xl mx-auto">
        Find the perfect coverage for your needs. Compare plans and select the best option for you or your family.
      </p>
    </div>

    {/* Comparison Bar */}
    {comparisonMode && comparedPlans.length > 0 && <div className="fixed bottom-0 left-0 right-0 bg-blue-50 p-4 border-t border-blue-200 shadow-lg z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="font-medium text-blue-800">Comparing {comparedPlans.length} plans:</span>
          {comparedPlans.map(id => <span key={id} className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-blue-200">
            {plans.find(p => p.id === id).name}
          </span>)}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setComparisonMode(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md">
            Complete Comparison
          </button>
          <button onClick={() => setComparedPlans([])} className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">
            Clear All
          </button>
        </div>
      </div>
    </div>}

    {/* Plan Selection Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {plans.map(plan => <div
        key={plan.id}
        className={`
              border rounded-xl overflow-hidden transition-all duration-300 
              hover:shadow-lg relative
              ${comparedPlans.includes(plan.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''}
              ${plan.popular ? 'border-2 border-blue-400' : 'border-gray-200'}
            `}
      >
        {plan.popular && <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          MOST POPULAR
          </div>}
            
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
            <span className="text-blue-600 font-bold">${plan.price}<span className="text-gray-500 text-sm font-normal">/month</span></span>
          </div>
              
          <p className="text-gray-600 mt-2 mb-4">{plan.description}</p>
              
          <button onClick={() => toggleDetails(plan.id)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center mb-4">
            {showDetails[plan.id] ? 'Hide Details' : 'View Details'} 
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform ${showDetails[plan.id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
              
          {showDetails[plan.id] && <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>)}
            </ul>}
              
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => selectPlanForComparison(plan.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors shadow
                    ${comparedPlans.includes(plan.id) ? 'bg-blue-600 text-white' : selectedPlan === plan.id ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-white text-blue-600 border border-gray-300 hover:bg-gray-50'}`}
            >
              {comparedPlans.includes(plan.id) ? 'Added to Compare' : selectedPlan === plan.id ? 'Selected ✓' : comparisonMode ? 'Add to Compare' : 'Select Plan'}
            </button>
          </div>
        </div>
      </div>)}
    </div>

    {/* Comparison Section */}
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-inner">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Compare Plans</h2>
          <p className="text-gray-600">Select up to 2 plans to compare features side-by-side</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
            setComparisonMode(!comparisonMode);
            if (!comparisonMode) setComparedPlans([]);
          }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors shadow
                ${comparisonMode ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {comparisonMode ? 'Exit Comparison' : 'Compare Plans'}
          </button>
            
          {comparisonMode && comparedPlans.length > 0 && <button onClick={() => setComparedPlans([])} className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow">
            Clear Selection
          </button>}
        </div>
      </div>
        
      {comparisonMode && comparedPlans.length === 0 ? <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No plans selected for comparison</h3>
        <p className="text-gray-500">Select up to 2 plans to start comparing features</p>
      </div> : null}
        
      {comparisonMode && comparedPlans.length > 0 && <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-medium text-gray-500">Features</th>
              {comparedPlans.map(id => <th key={id} className="text-center p-4 font-bold text-gray-800">
                {plans.find(p => p.id === id).name}
              </th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-4 font-medium">Monthly Cost</td>
              {comparedPlans.map(id => <td key={id} className="text-center p-4">
                <span className="font-bold text-lg">${plans.find(p => p.id === id).price}</span>
                <span className="text-gray-500">/month</span>
              </td>)}
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-4 font-medium">Plan Description</td>
              {comparedPlans.map(id => <td key={id} className="text-center p-4 text-gray-600">
                {plans.find(p => p.id === id).description}
              </td>)}
            </tr>
            {plans[0].features.map((_, index) => <tr key={index} className="border-b border-gray-200">
              <td className="p-4 font-medium">
                {plans[0].features[index].split(':')[0]}
              </td>
              {comparedPlans.map(id => <td key={id} className="text-center p-4">
                {plans.find(p => p.id === id).features[index] || '-'}
              </td>)}
            </tr>)}
          </tbody>
        </table>
      </div>}
    </div>
  </div>;
};
export default HealthInsurance;
