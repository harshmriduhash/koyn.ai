import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ApiKey, UsageStat } from '../types';
import { marketplaceService } from '../services/marketplaceService';
import LoadingSpinner from '../components/LoadingSpinner';
import { KeyIcon, ChartBarIcon, DocumentDuplicateIcon, CheckIcon, XMarkIcon } from '../components/IconComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { APP_NAME } from '../constants';


const ApiKeyManager: React.FC<{ userId: string }> = ({ userId }) => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['read:models']); // Default scope

    const fetchApiKeys = useCallback(async () => {
        setIsLoading(true);
        const keys = await marketplaceService.getApiKeys(userId);
        setApiKeys(keys);
        setIsLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchApiKeys();
    }, [fetchApiKeys]);
    
    const handleCreateKey = async () => {
        if(newKeyScopes.length === 0) {
            alert("Please select at least one scope for the API key.");
            return;
        }
        await marketplaceService.createApiKey(userId, newKeyScopes);
        setShowCreateModal(false);
        setNewKeyScopes(['read:models']); // Reset scopes
        fetchApiKeys(); // Refresh keys
    };

    const handleDeleteKey = async (keyId: string) => {
        if (window.confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
            await marketplaceService.deleteApiKey(userId, keyId);
            fetchApiKeys(); // Refresh keys
        }
    };
    
    const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
    const handleCopyKey = (key: string, keyId: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKeyId(keyId);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };


    if (isLoading) return <LoadingSpinner text="Loading API Keys..." />;

    return (
        <div className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">Your API Keys</h3>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
                >
                    Create New Key
                </button>
            </div>
            {apiKeys.length === 0 ? (
                <p className="text-text-muted-light dark:text-text-muted-dark">You haven't created any API keys yet.</p>
            ) : (
                <ul className="space-y-3">
                    {apiKeys.map(key => (
                        <li key={key.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <p className="font-mono text-sm text-text-light dark:text-text-dark break-all">{key.key}</p>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                                    Created: {new Date(key.createdAt).toLocaleDateString()} | Scopes: {key.scopes.join(', ')}
                                </p>
                            </div>
                            <div className="flex space-x-2 mt-2 sm:mt-0">
                               <button onClick={() => handleCopyKey(key.key, key.id)} className="p-1.5 text-text-muted-light dark:text-text-muted-dark hover:text-primary-DEFAULT dark:hover:text-primary-light rounded-md" title="Copy API Key">
                                 {copiedKeyId === key.id ? <CheckIcon size={18} className="text-green-500"/> : <DocumentDuplicateIcon size={18}/>}
                               </button>
                               <button onClick={() => handleDeleteKey(key.id)} className="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-md" title="Delete API Key">
                                 <XMarkIcon size={18}/>
                               </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {/* Create Key Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h4 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">Create New API Key</h4>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Scopes:</label>
                            {/* Simplified scope selection; in a real app, this would be more detailed */}
                            <div className="space-y-1">
                                {['read:models', 'predict:all', 'manage:billing'].map(scope => (
                                    <label key={scope} className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            className="form-checkbox h-4 w-4 text-primary-DEFAULT rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary-DEFAULT"
                                            value={scope}
                                            checked={newKeyScopes.includes(scope)}
                                            onChange={e => {
                                                if (e.target.checked) setNewKeyScopes(prev => [...prev, scope]);
                                                else setNewKeyScopes(prev => prev.filter(s => s !== scope));
                                            }}
                                        />
                                        <span className="ml-2 text-sm text-text-light dark:text-text-dark">{scope}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                            <button onClick={handleCreateKey} className="px-4 py-2 text-sm bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark">Create Key</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UsageAnalytics: React.FC<{ userId: string }> = ({ userId }) => {
    const [usageData, setUsageData] = useState<UsageStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    useEffect(() => {
        const fetchUsage = async () => {
            setIsLoading(true);
            const data = await marketplaceService.getUsageStats(userId, period);
            setUsageData(data);
            setIsLoading(false);
        };
        fetchUsage();
    }, [userId, period]);

    if (isLoading) return <LoadingSpinner text="Loading Usage Analytics..." />;

    return (
        <div className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">Usage Analytics</h3>
                <select value={period} onChange={e => setPeriod(e.target.value as '7d' | '30d' | '90d')} className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark text-sm focus:ring-primary-DEFAULT focus:border-primary-DEFAULT">
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                </select>
            </div>
            {usageData.length === 0 ? (
                 <p className="text-text-muted-light dark:text-text-muted-dark">No usage data available for this period.</p>
            ) : (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={usageData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} style={{ fontSize: '0.75rem' }} />
                            <YAxis style={{ fontSize: '0.75rem' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.375rem' }} 
                                labelStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
                                itemStyle={{ color: '#9ca3af' }}
                            />
                            <Legend wrapperStyle={{fontSize: '0.875rem'}} />
                            <Line type="monotone" dataKey="requests" stroke="rgb(59 130 246)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} name="API Requests" />
                            {usageData.some(d => d.cost !== undefined) && <Line type="monotone" dataKey="cost" stroke="rgb(16 185 129)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Cost ($)" />}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};


const DashboardPage: React.FC = () => {
  const { currentUser, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (currentUser) {
        document.title = `${currentUser.accountType === 'creator' ? 'Creator' : 'Consumer'} Dashboard | ${APP_NAME}`;
    } else {
        document.title = `Dashboard | ${APP_NAME}`;
    }
  }, [currentUser]);

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>;
  }

  if (!currentUser || currentUser.accountType === 'guest') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-3">
            {currentUser.accountType === 'creator' ? 'Creator Dashboard' : 'Consumer Dashboard'}
        </h1>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark">Welcome back, {currentUser.username}!</p>
      </div>

      <div className="space-y-8">
        {currentUser.accountType === 'consumer' && (
          <>
            <section>
                <div className="flex items-center mb-4">
                    <KeyIcon size={24} className="text-secondary-DEFAULT mr-3" />
                    <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">API Key Management</h2>
                </div>
                <ApiKeyManager userId={currentUser.id} />
            </section>
            <section>
                <div className="flex items-center mb-4">
                    <ChartBarIcon size={24} className="text-secondary-DEFAULT mr-3" />
                    <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Usage Analytics</h2>
                </div>
                <UsageAnalytics userId={currentUser.id} />
            </section>
          </>
        )}

        {currentUser.accountType === 'creator' && (
          <>
            <section>
              <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">My Models</h2>
              <p className="text-text-muted-light dark:text-text-muted-dark">Manage your published models and view their performance. (Creator model listing coming soon)</p>
            </section>
            <section>
                <div className="flex items-center mb-4">
                    <ChartBarIcon size={24} className="text-secondary-DEFAULT mr-3" />
                    <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Earnings & Model Stats</h2>
                </div>
              {/* For now, reuse UsageAnalytics as a placeholder for earnings/model stats */}
              <UsageAnalytics userId={currentUser.id} /> 
              <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark"> (Placeholder: Showing general usage. Creator-specific earnings and model performance charts coming soon.)</p>
            </section>
          </>
        )}
        
        <section className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3">Account Settings</h3>
            <p className="text-text-muted-light dark:text-text-muted-dark">Update your profile, manage subscriptions, and billing information. (Settings UI coming soon)</p>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;