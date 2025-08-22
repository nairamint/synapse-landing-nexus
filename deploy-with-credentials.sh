#!/bin/bash

# Deploy Supabase Edge Functions using provided credentials
# This script deploys the env-validation and websocket-server functions

set -e

PROJECT_REF="hnwwykttyzfvflmcswjk"
SUPABASE_URL="https://hnwwykttyzfvflmcswjk.supabase.co"

# Your provided credentials
CLIENT_ID="e41eb39c-fe87-4737-b8c4-5885acedcc32"
CLIENT_SECRET="sba_80a4cd66e9009227935a16d900b3339725595567"

echo "🚀 Starting Edge Function deployment with provided credentials..."

# Function to get access token
get_access_token() {
    echo "🔐 Getting access token..."
    
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"grant_type\": \"client_credentials\",
            \"client_id\": \"$CLIENT_ID\",
            \"client_secret\": \"$CLIENT_SECRET\"
        }" \
        "https://api.supabase.com/v1/auth/token")
    
    access_token=$(echo "$response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$access_token" ]; then
        echo "❌ Failed to get access token"
        echo "Response: $response"
        exit 1
    fi
    
    echo "✅ Access token obtained"
    echo "$access_token"
}

# Function to deploy an Edge Function
deploy_function() {
    local function_name=$1
    local function_path=$2
    local access_token=$3
    
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
    
    # Deploy using curl with access token
    echo "🔄 Uploading $function_name..."
    
    response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $access_token" \
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

# Main deployment process
echo "🔄 Getting access token..."
ACCESS_TOKEN=$(get_access_token)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Failed to obtain access token"
    exit 1
fi

echo "🔄 Deploying Edge Functions..."

# Deploy env-validation function
if [ -f "supabase/functions/env-validation/index.ts" ]; then
    deploy_function "env-validation" "supabase/functions/env-validation/index.ts" "$ACCESS_TOKEN"
else
    echo "❌ env-validation function not found at supabase/functions/env-validation/index.ts"
fi

# Deploy websocket-server function
if [ -f "supabase/functions/websocket-server/index.ts" ]; then
    deploy_function "websocket-server" "supabase/functions/websocket-server/index.ts" "$ACCESS_TOKEN"
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
echo "2. Update environment to disable mock mode:"
echo "   VITE_ENABLE_MOCK_MODE=false"
echo ""
echo "3. Navigate to your testing page:"
echo "   http://localhost:5173/testing"
echo ""
echo "4. Test the WebSocket and Environment validation components"