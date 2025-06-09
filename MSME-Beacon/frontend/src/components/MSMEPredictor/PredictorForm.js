import React, { useState } from 'react';
import axios from 'axios';

const PredictorForm = ({ setLoading, setPrediction }) => {
  const [formData, setFormData] = useState({
    monthly_sales: '',
    stock_value: '',
    num_customers: '',
    monthly_expenses: '',
    monthly_profit: '',
    num_employees: '',
    avg_transaction_value: '',
    return_rate: '',
    marketing_spend: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields have numeric values
    Object.keys(formData).forEach(key => {
      if (!formData[key] || isNaN(parseFloat(formData[key]))) {
        newErrors[key] = 'Please enter a valid number';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert string values to numbers
    const numericData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = parseFloat(formData[key]);
      return acc;
    }, {});
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/predict-manual', numericData);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error making prediction:', error);
      setPrediction({ error: 'Failed to make prediction. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create a more user-friendly label
  const formatLabel = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(formData).map((feature) => (
          <div key={feature} className="space-y-1">
            <label htmlFor={feature} className="block text-sm font-medium text-gray-700">
              {formatLabel(feature)}
            </label>
            <input
              type="number"
              id={feature}
              name={feature}
              value={formData[feature]}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors[feature] ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder={`Enter ${formatLabel(feature).toLowerCase()}`}
              step="any"
            />
            {errors[feature] && (
              <p className="mt-1 text-sm text-red-600">{errors[feature]}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Make Prediction
        </button>
      </div>
    </form>
  );
};

export default PredictorForm; 