import React, { useState } from 'react';

const EnvironmentValidator: React.FC = () => {
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const validateEnv = async () => {
    setValidating(true);
    setError(null);
    setResults(null);
    
    try {
      // Get environment variables from your .env file
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const ocrApiKey = import.meta.env.VITE_OCR_API_KEY;
      const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

      // Call your validation Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/env-validation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseUrl,
          supabaseAnonKey,
          ocrApiKey,
          websocketUrl
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">Environment Variables Validation</h2>
      
      <button
        onClick={validateEnv}
        disabled={validating}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {validating ? 'Validating...' : 'Validate Environment'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {results && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Validation Results:</h3>
          
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <p className="flex justify-between">
                <span>Supabase Connection:</span>
                <span className={results.supabase ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {results.supabase ? '✅ Valid' : '❌ Invalid'}
                </span>
              </p>
              <p className="text-sm text-gray-600">{results.details.supabase}</p>
            </div>
            
            <div className="p-3 border rounded">
              <p className="flex justify-between">
                <span>OCR API Key:</span>
                <span className={results.ocr ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {results.ocr ? '✅ Valid' : '❌ Invalid'}
                </span>
              </p>
              <p className="text-sm text-gray-600">{results.details.ocr}</p>
            </div>
            
            <div className="p-3 border rounded">
              <p className="flex justify-between">
                <span>WebSocket URL:</span>
                <span className={results.websocket ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {results.websocket ? '✅ Valid' : '❌ Invalid'}
                </span>
              </p>
              <p className="text-sm text-gray-600">{results.details.websocket}</p>
            </div>
          </div>
          
          <div className={`mt-4 p-3 rounded ${results.allValid ? 'bg-green-100 border-green-400 text-green-700' : 'bg-yellow-100 border-yellow-400 text-yellow-700'}`}>
            <p className="font-bold">
              {results.allValid 
                ? '✅ All environment variables are valid!' 
                : '⚠️ Some environment variables need attention.'}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold">Expected Environment Variables:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>VITE_SUPABASE_URL - Your Supabase project URL</li>
          <li>VITE_SUPABASE_ANON_KEY - Your Supabase anon/public key</li>
          <li>VITE_OCR_API_KEY - Your OCR.space API key</li>
          <li>VITE_WEBSOCKET_URL - URL to your WebSocket server Edge Function</li>
        </ul>
      </div>
    </div>
  );
};

export default EnvironmentValidator;