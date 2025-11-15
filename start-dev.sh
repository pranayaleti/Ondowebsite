#!/bin/bash

# Start development servers for OndoSoft
# This script starts both the backend and frontend servers

echo "🚀 Starting OndoSoft Development Servers..."
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
  echo "❌ Error: backend directory not found"
  exit 1
fi

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down servers..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit
}

trap cleanup SIGINT SIGTERM

# Start backend server
echo "📦 Starting backend server on port 5001..."
cd backend
node index.js &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend server is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done

# Start frontend server
echo "🎨 Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait

