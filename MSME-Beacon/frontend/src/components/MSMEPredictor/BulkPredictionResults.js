import React from 'react';

const BulkPredictionResults = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  // Calculate summary statistics
  const total = predictions.length;
  const lowRisk = predictions.filter(p => p.prediction === "Low Risk").length;
  const mediumRisk = predictions.filter(p => p.prediction === "Medium Risk").length;
  const highRisk = predictions.filter(p => p.prediction === "High Risk").length;
  const survivalRate = (lowRisk / total) * 100;

  return (
    <div className="mt-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-indigo-50">
          <h3 className="text-lg leading-6 font-medium text-indigo-900">
            Bulk Prediction Results
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-indigo-600">
            Showing predictions for {total} businesses
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-green-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-green-900">Low Risk</h4>
                  <p className="mt-1 text-2xl font-semibold text-green-700">{lowRisk}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-yellow-900">Medium Risk</h4>
                  <p className="mt-1 text-2xl font-semibold text-yellow-700">{mediumRisk}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-red-900">High Risk</h4>
                  <p className="mt-1 text-2xl font-semibold text-red-700">{highRisk}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-blue-900">Health Rate</h4>
                <p className="mt-1 text-2xl font-semibold text-blue-700">{survivalRate.toFixed(1)}%</p>
              </div>
              <div className="ml-auto">
                <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600" 
                    style={{ width: `${survivalRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key Factors
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((pred, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${pred.prediction === 'Low Risk' ? 'bg-green-100 text-green-800' : 
                        pred.prediction === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {pred.prediction}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pred.risk_score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pred.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                      <div className="relative w-16 h-2 bg-gray-200 rounded">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded 
                            ${pred.prediction === 'Low Risk' ? 'bg-green-600' : 
                              pred.prediction === 'Medium Risk' ? 'bg-yellow-600' : 
                              'bg-red-600'}`} 
                          style={{ width: `${pred.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {pred.key_factors && pred.key_factors.length > 0 
                      ? pred.key_factors.map(f => 
                        f.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                      ).join(', ')
                      : 'None identified'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkPredictionResults; 