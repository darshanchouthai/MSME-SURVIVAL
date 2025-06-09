import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: false,
      sms: false,
      app: false,
      marketing: false
    },
    privacy: {
      shareData: false,
      allowTracking: false
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactView: false
    },
    language: 'English',
    timezone: 'UTC+05:30 (India Standard Time)'
  });

  // Load user-specific settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5001/api/users/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success && data.data) {
          setSettings({
            notifications: data.data.notifications || settings.notifications,
            privacy: data.data.privacy || settings.privacy,
            appearance: data.data.appearance || settings.appearance,
            language: data.data.language?.primary || settings.language,
            timezone: data.data.regional?.timezone || settings.timezone
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handlePrivacyChange = (type) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type]
      }
    }));
  };

  const handleAppearanceChange = (type, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [type]: type === 'compactView' ? !prev.appearance.compactView : value
      }
    }));
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
    }));
  };

  const handleTimezoneChange = (e) => {
    setSettings(prev => ({
      ...prev,
      timezone: e.target.value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again');
        return;
      }

      const settingsUpdateData = {
        notifications: settings.notifications,
        privacy: settings.privacy,
        appearance: settings.appearance,
        language: {
          primary: settings.language
        },
        regional: {
          timezone: settings.timezone
        }
      };

      const response = await fetch('http://localhost:5001/api/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsUpdateData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Settings saved successfully!');
      } else {
        throw new Error(data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400 bg-opacity-20 rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-white via-purple-50 to-indigo-100 rounded-full flex items-center justify-center shadow-2xl border-4 border-white border-opacity-30">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Settings
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Customize your application experience and preferences with our comprehensive settings management system.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="animate-pulse">
              <div className="flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                      <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Notification Settings */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Notification Settings
                </h2>
                <p className="text-blue-100 mt-1">Manage how we contact you and send notifications</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: 'email',
                      title: 'Email Notifications',
                      description: 'Receive updates, alerts, and recommendations via email',
                      icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                      checked: settings.notifications.email
                    },
                    {
                      id: 'sms',
                      title: 'SMS Notifications',
                      description: 'Receive time-sensitive alerts via text message',
                      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                      checked: settings.notifications.sms
                    },
                    {
                      id: 'app',
                      title: 'In-App Notifications',
                      description: 'Receive notifications within the application',
                      icon: 'M15 17h5l-5 5v-5zM4 19h1l10-10 3 3L8 22H4v-3z',
                      checked: settings.notifications.app
                    },
                    {
                      id: 'marketing',
                      title: 'Marketing Communications',
                      description: 'Receive product updates, offers, and newsletters',
                      icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
                      checked: settings.notifications.marketing
                    }
                  ].map((item) => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleNotificationChange(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Privacy Settings */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  Privacy Settings
                </h2>
                <p className="text-green-100 mt-1">Manage how your data is used and shared</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: 'shareData',
                      title: 'Share Usage Data',
                      description: 'Allow us to share anonymized usage data to improve our services',
                      icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
                      checked: settings.privacy.shareData
                    },
                    {
                      id: 'allowTracking',
                      title: 'Allow Analytics Tracking',
                      description: 'Allow us to track your in-app activity to improve user experience',
                      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                      checked: settings.privacy.allowTracking
                    }
                  ].map((item) => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handlePrivacyChange(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Appearance Settings */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  Appearance Settings
                </h2>
                <p className="text-purple-100 mt-1">Customize how the application looks and feels</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Theme</h3>
                        <p className="text-sm text-gray-600">Choose your preferred theme</p>
                      </div>
                    </div>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">Use System Setting</option>
                    </select>
                  </div>
                  
                  {/* Font Size */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Font Size</h3>
                        <p className="text-sm text-gray-600">Adjust text size for readability</p>
                      </div>
                    </div>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  {/* Compact View */}
                  <div className="md:col-span-2">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Compact View</h3>
                            <p className="text-sm text-gray-600">Use a more compact layout to show more content on screen</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.appearance.compactView}
                            onChange={() => handleAppearanceChange('compactView')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Regional Settings */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Regional Settings
                </h2>
                <p className="text-teal-100 mt-1">Manage language and time zone preferences</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Language Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Language</h3>
                        <p className="text-sm text-gray-600">Select your preferred language</p>
                      </div>
                    </div>
                    <select
                      value={settings.language}
                      onChange={handleLanguageChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                  
                  {/* Timezone Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Time Zone</h3>
                        <p className="text-sm text-gray-600">Set your local time zone</p>
                      </div>
                    </div>
                    <select
                      value={settings.timezone}
                      onChange={handleTimezoneChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    >
                      <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                      <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                      <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                      <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                      <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                      <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                      <option value="UTC+5:30 (India Standard Time)">UTC+5:30 (India Standard Time)</option>
                      <option value="UTC+8 (China Standard Time)">UTC+8 (China Standard Time)</option>
                      <option value="UTC+9 (Japan Standard Time)">UTC+9 (Japan Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save Settings Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage; 