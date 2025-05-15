# EdPsych Connect Installation Guide

## Prerequisites

- Python 3.11 or higher
- Node.js 20.x or higher
- PostgreSQL 14 or higher
- Git

## Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/EdPsychConnect.git
   cd EdPsychConnect
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```bash
   python setup_assessment_db.py
   python setup_messaging_db.py
   python setup_resource_library_db.py
   ```

5. Run the backend server:
   ```bash
   python -m educator_dashboard.main_dashboard_app
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Access the application at http://localhost:3000

## Configuration

1. Copy the example configuration file:
   ```bash
   cp config.example.py config.py
   ```

2. Edit the configuration file with your settings:
   ```bash
   nano config.py
   ```

## Production Deployment

See the [Deployment Guide](deployment_guide.md) for production deployment instructions.
