#!/bin/bash

# Deploy Supabase Edge Functions using Management API
# This script deploys the env-validation and websocket-server functions

set -e

PROJECT_REF="hnwwykttyzfvflmcswjk"
SUPABASE_URL="https://hnwwykttyzfvflmcswjk.supabase.co"

echo "🚀 Starting Edge Function deployment..."

# Check if we have the required environment variables
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN environment variable is required"
    echo "💡 Get your access token from: https://app.supabase.com/account/tokens"
    echo "💡 Then run: export SUPABASE_ACCESS_TOKEN='your-token-here'"
    exit 1
fi

# Function to deploy an Edge Function
deploy_function() {
    local function_name=$1
    local function_path=$2
    
    echo "📦 Deploying function: $function_name"
    
    # Create a temporary directory for the function
    temp_dir=$(mktemp -d)
    
    # Copy the function file
    cp "$function_path" "$temp_dir/index.ts"
    
    # Create deno.json
    cat > "$temp_dir/deno.json" << EOF
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.ns", "deno.window"]
  },
  "importMap": "import_map.json"
}
EOF
    
    # Create import_map.json
    cat > "$temp_dir/import_map.json" << EOF
{
  "imports": {
    "std/": "https://deno.land/std@0.168.0/"
  }
}
EOF
    
    # Create a zip file
    cd "$temp_dir"
    zip -r "../${function_name}.zip" .
    cd - > /dev/null
    
    # Deploy using curl
    echo "🔄 Uploading $function_name..."
    
    response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
        -H "Content-Type: application/zip" \
        --data-binary "@${temp_dir}/../${function_name}.zip" \
        "https://api.supabase.com/v1/projects/$PROJECT_REF/functions/$function_name" \
        -o /tmp/deploy_response.json)
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
        echo "✅ Successfully deployed $function_name"
    else
        echo "❌ Failed to deploy $function_name (HTTP $response)"
        echo "Response:"
        cat /tmp/deploy_response.json
    fi
    
    # Cleanup
    rm -rf "$temp_dir"
    rm -f "${temp_dir}/../${function_name}.zip"
}

# Deploy the functions
echo "🔄 Deploying Edge Functions..."

# Deploy env-validation function
if [ -f "supabase/functions/env-validation/index.ts" ]; then
    deploy_function "env-validation" "supabase/functions/env-validation/index.ts"
else
    echo "❌ env-validation function not found at supabase/functions/env-validation/index.ts"
fi

# Deploy websocket-server function
if [ -f "supabase/functions/websocket-server/index.ts" ]; then
    deploy_function "websocket-server" "supabase/functions/websocket-server/index.ts"
else
    echo "❌ websocket-server function not found at supabase/functions/websocket-server/index.ts"
fi

echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Test the functions:"
echo "   curl $SUPABASE_URL/functions/v1/env-validation"
echo "   wss://$PROJECT_REF.supabase.co/functions/v1/websocket-server"
echo ""
echo "2. Navigate to your testing page:"
echo "   http://localhost:5173/testing"
echo ""
echo "3. Test the WebSocket and Environment validation components"