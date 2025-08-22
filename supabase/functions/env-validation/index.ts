import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ValidationRequest {
  supabaseUrl: string;
  supabaseAnonKey: string;
  ocrApiKey: string;
  websocketUrl: string;
}

interface ValidationResult {
  success: boolean;
  results: {
    supabase: boolean;
    ocr: boolean;
    websocket: boolean;
    allValid: boolean;
    details: {
      supabase: string;
      ocr: string;
      websocket: string;
    };
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    const { supabaseUrl, supabaseAnonKey, ocrApiKey, websocketUrl }: ValidationRequest = await req.json()

    const results = {
      supabase: false,
      ocr: false,
      websocket: false,
      allValid: false,
      details: {
        supabase: '',
        ocr: '',
        websocket: ''
      }
    }

    // Test Supabase connection
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        // Test a simple query
        const { data, error } = await supabase
          .from('compliance_assessments')
          .select('count')
          .limit(1)
        
        if (!error) {
          results.supabase = true
          results.details.supabase = 'Successfully connected to Supabase'
        } else {
          results.details.supabase = `Supabase connection failed: ${error.message}`
        }
      } else {
        results.details.supabase = 'Missing Supabase URL or API key'
      }
    } catch (error) {
      results.details.supabase = `Supabase validation error: ${error.message}`
    }

    // Test OCR API
    try {
      if (ocrApiKey) {
        // Test OCR API with a simple request
        const ocrResponse = await fetch('https://api.ocr.space/parse/imageurl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            apikey: ocrApiKey,
            url: 'https://example.com/test-image.jpg', // Test URL
            language: 'eng',
            isOverlayRequired: 'false'
          })
        })

        if (ocrResponse.ok) {
          const ocrData = await ocrResponse.json()
          if (ocrData.ParsedResults || ocrData.ErrorMessage === 'No text found') {
            results.ocr = true
            results.details.ocr = 'OCR API key is valid'
          } else {
            results.details.ocr = `OCR API error: ${ocrData.ErrorMessage || 'Unknown error'}`
          }
        } else {
          results.details.ocr = `OCR API request failed: ${ocrResponse.status}`
        }
      } else {
        results.details.ocr = 'OCR API key not provided'
      }
    } catch (error) {
      results.details.ocr = `OCR validation error: ${error.message}`
    }

    // Test WebSocket URL format
    try {
      if (websocketUrl) {
        // Basic WebSocket URL validation
        const wsUrl = new URL(websocketUrl)
        if (wsUrl.protocol === 'ws:' || wsUrl.protocol === 'wss:') {
          results.websocket = true
          results.details.websocket = 'WebSocket URL format is valid'
        } else {
          results.details.websocket = 'Invalid WebSocket URL protocol (must be ws:// or wss://)'
        }
      } else {
        results.details.websocket = 'WebSocket URL not provided'
      }
    } catch (error) {
      results.details.websocket = `WebSocket URL validation error: ${error.message}`
    }

    // Check if all validations passed
    results.allValid = results.supabase && results.ocr && results.websocket

    const response: ValidationResult = {
      success: true,
      results
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )

  } catch (error) {
    const response: ValidationResult = {
      success: false,
      results: {
        supabase: false,
        ocr: false,
        websocket: false,
        allValid: false,
        details: {
          supabase: 'Validation failed',
          ocr: 'Validation failed',
          websocket: 'Validation failed'
        }
      },
      error: error.message
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
})