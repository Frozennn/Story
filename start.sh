#!/bin/bash

# Travian Farm Automation Startup Script
# Usage: ./start.sh [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_error "Please install Node.js 16+ from: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version $NODE_VERSION is too old!"
        print_error "Please install Node.js 16+ from: https://nodejs.org/"
        exit 1
    fi
    
    print_success "Node.js $(node --version) detected"
}

# Function to check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        print_error "Please install npm or use yarn instead"
        exit 1
    fi
    
    print_success "npm $(npm --version) detected"
}

# Function to install dependencies
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
        print_success "Dependencies installed successfully"
    else
        print_status "Dependencies already installed"
    fi
}

# Function to check configuration
check_config() {
    if [ ! -f "config.json" ]; then
        print_error "config.json not found!"
        print_error "Please copy and configure config.json:"
        print_error "  1. Copy the example: cp config.json config.json"
        print_error "  2. Edit with your credentials: nano config.json"
        exit 1
    fi
    
    # Check if username/password are configured
    if grep -q "YOUR_USERNAME" config.json; then
        print_warning "Please configure your username in config.json"
        print_warning "Current value: YOUR_USERNAME"
    fi
    
    if grep -q "YOUR_PASSWORD" config.json; then
        print_warning "Please configure your password in config.json"
        print_warning "Current value: YOUR_PASSWORD"
    fi
    
    print_success "Configuration file found"
}

# Function to create logs directory
create_logs_dir() {
    if [ ! -d "logs" ]; then
        mkdir -p logs
        print_status "Created logs directory"
    fi
}

# Function to display banner
display_banner() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                🚜 TRAVIAN FARM AUTOMATION 🚜             ║"
    echo "║                                                          ║"
    echo "║  Automated farm list sender for Travian Legends T4.6+   ║"
    echo "║  With advanced anti-detection and human-like behavior   ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
}

# Function to display warnings
display_warnings() {
    echo -e "${RED}⚠️  IMPORTANT WARNINGS ⚠️${NC}"
    echo -e "${YELLOW}• Use this script at your own risk${NC}"
    echo -e "${YELLOW}• Bot usage may violate Travian Terms of Service${NC}"
    echo -e "${YELLOW}• Author is not responsible for account bans${NC}"
    echo -e "${YELLOW}• This script is for educational purposes only${NC}"
    echo
    echo -e "${BLUE}Press Ctrl+C at any time to stop the automation${NC}"
    echo
}

# Function to show help
show_help() {
    echo "Usage: $0 [options]"
    echo
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -d, --debug    Run in debug mode with browser dev tools"
    echo "  -H, --headless Run in headless mode (background)"
    echo "  --install      Only install dependencies and exit"
    echo "  --check        Only check configuration and exit"
    echo
    echo "Examples:"
    echo "  $0                    # Normal start"
    echo "  $0 --debug           # Debug mode with dev tools"
    echo "  $0 --headless        # Background mode"
    echo "  $0 --install         # Install dependencies only"
    echo
}

# Parse command line arguments
HEADLESS_MODE=""
DEBUG_MODE=""
INSTALL_ONLY=false
CHECK_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--debug)
            DEBUG_MODE="dev"
            shift
            ;;
        -H|--headless)
            HEADLESS_MODE="true"
            shift
            ;;
        --install)
            INSTALL_ONLY=true
            shift
            ;;
        --check)
            CHECK_ONLY=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
main() {
    display_banner
    
    # System checks
    print_status "Performing system checks..."
    check_nodejs
    check_npm
    
    # Install dependencies
    install_dependencies
    
    if [ "$INSTALL_ONLY" = true ]; then
        print_success "Dependencies installed. Exiting."
        exit 0
    fi
    
    # Configuration checks
    check_config
    create_logs_dir
    
    if [ "$CHECK_ONLY" = true ]; then
        print_success "Configuration check completed. Exiting."
        exit 0
    fi
    
    # Display warnings
    display_warnings
    
    # Wait for user confirmation
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Aborted by user"
        exit 0
    fi
    
    # Start the application
    print_status "Starting Travian Farm Automation..."
    echo
    
    # Set environment variables
    if [ ! -z "$HEADLESS_MODE" ]; then
        export HEADLESS_MODE="$HEADLESS_MODE"
    fi
    
    # Choose run command
    if [ "$DEBUG_MODE" = "dev" ]; then
        print_status "Starting in debug mode..."
        npm run dev
    elif [ ! -z "$HEADLESS_MODE" ]; then
        print_status "Starting in headless mode..."
        npm start
    else
        print_status "Starting in normal mode..."
        npm start
    fi
}

# Trap Ctrl+C
trap 'print_warning "Interrupted by user. Shutting down..."; exit 130' INT

# Run main function
main "$@"