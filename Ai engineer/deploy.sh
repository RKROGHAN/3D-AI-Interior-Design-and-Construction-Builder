#!/bin/bash

# ArchGen Deployment Script
# This script handles deployment to various environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
BUILD_TYPE="production"
SKIP_TESTS=false
CLEAN_BUILD=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment ENV    Deployment environment (development|staging|production)"
    echo "  -b, --build-type TYPE    Build type (development|production)"
    echo "  -s, --skip-tests         Skip running tests"
    echo "  -c, --clean              Clean build (remove node_modules and rebuild)"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --environment production --build-type production"
    echo "  $0 -e staging -c"
    echo "  $0 --skip-tests"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -b|--build-type)
            BUILD_TYPE="$2"
            shift 2
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -c|--clean)
            CLEAN_BUILD=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_error "Valid environments: development, staging, production"
    exit 1
fi

# Validate build type
if [[ ! "$BUILD_TYPE" =~ ^(development|production)$ ]]; then
    print_error "Invalid build type: $BUILD_TYPE"
    print_error "Valid build types: development, production"
    exit 1
fi

print_status "Starting ArchGen deployment..."
print_status "Environment: $ENVIRONMENT"
print_status "Build type: $BUILD_TYPE"
print_status "Skip tests: $SKIP_TESTS"
print_status "Clean build: $CLEAN_BUILD"

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed - skipping containerized deployment"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed - skipping containerized deployment"
    fi
    
    print_success "Dependencies check completed"
}

# Clean build function
clean_build() {
    if [ "$CLEAN_BUILD" = true ]; then
        print_status "Cleaning build artifacts..."
        
        # Remove node_modules
        if [ -d "node_modules" ]; then
            rm -rf node_modules
            print_status "Removed root node_modules"
        fi
        
        if [ -d "client/node_modules" ]; then
            rm -rf client/node_modules
            print_status "Removed client node_modules"
        fi
        
        if [ -d "server/node_modules" ]; then
            rm -rf server/node_modules
            print_status "Removed server node_modules"
        fi
        
        # Remove build directories
        if [ -d "client/build" ]; then
            rm -rf client/build
            print_status "Removed client build directory"
        fi
        
        print_success "Clean build completed"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install client dependencies
    cd client
    npm install
    cd ..
    
    # Install server dependencies
    cd server
    npm install
    cd ..
    
    print_success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        print_warning "Skipping tests"
        return
    fi
    
    print_status "Running tests..."
    
    # Run client tests
    cd client
    if npm run test -- --watchAll=false --passWithNoTests; then
        print_success "Client tests passed"
    else
        print_error "Client tests failed"
        exit 1
    fi
    cd ..
    
    # Run server tests (if available)
    cd server
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        if npm test; then
            print_success "Server tests passed"
        else
            print_error "Server tests failed"
            exit 1
        fi
    else
        print_warning "No server tests configured"
    fi
    cd ..
    
    print_success "All tests passed"
}

# Build application
build_application() {
    print_status "Building application..."
    
    # Build client
    cd client
    if [ "$BUILD_TYPE" = "production" ]; then
        npm run build
        print_success "Client built for production"
    else
        print_status "Skipping client build for development"
    fi
    cd ..
    
    print_success "Application build completed"
}

# Deploy with Docker
deploy_docker() {
    if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
        print_warning "Docker not available - skipping containerized deployment"
        return
    fi
    
    print_status "Deploying with Docker..."
    
    # Set environment variables for Docker Compose
    export NODE_ENV=$ENVIRONMENT
    export BUILD_TYPE=$BUILD_TYPE
    
    # Stop existing containers
    docker-compose down
    
    # Build and start containers
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose up -d --build
    else
        docker-compose --profile dev up -d --build
    fi
    
    print_success "Docker deployment completed"
}

# Deploy without Docker
deploy_standalone() {
    print_status "Deploying standalone application..."
    
    # Set environment variables
    export NODE_ENV=$ENVIRONMENT
    
    # Start server
    cd server
    if [ "$ENVIRONMENT" = "production" ]; then
        print_status "Starting production server..."
        npm start &
    else
        print_status "Starting development server..."
        npm run dev &
    fi
    cd ..
    
    # Start client (development only)
    if [ "$ENVIRONMENT" != "production" ]; then
        cd client
        print_status "Starting development client..."
        npm start &
        cd ..
    fi
    
    print_success "Standalone deployment completed"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for services to start
    sleep 10
    
    # Check server health
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_success "Server health check passed"
    else
        print_error "Server health check failed"
        exit 1
    fi
    
    # Check client (if running)
    if [ "$ENVIRONMENT" != "production" ]; then
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_success "Client health check passed"
        else
            print_warning "Client health check failed (may still be starting)"
        fi
    fi
    
    print_success "Health check completed"
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Check dependencies
    check_dependencies
    
    # Clean build if requested
    clean_build
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Build application
    build_application
    
    # Deploy application
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        deploy_docker
    else
        deploy_standalone
    fi
    
    # Health check
    health_check
    
    print_success "Deployment completed successfully!"
    print_status "Application is running at:"
    if [ "$ENVIRONMENT" = "production" ]; then
        print_status "  - Server: http://localhost:5000"
    else
        print_status "  - Client: http://localhost:3000"
        print_status "  - Server: http://localhost:5000"
    fi
}

# Run main function
main "$@"
