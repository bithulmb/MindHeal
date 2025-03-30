# MindHeal

MindHeal is a web platform that connects users with psychologists and counselors. It enables users to book online sessions, make payments, and interact with counselors via chat and video calls.

## Features
- **Landing Page**: Welcomes users and lists all website features.
- **Counselor Listings**: Users can browse and filter psychologists based on language and expertise.
- **Booking System**: Users can select a psychologist, make payments via Razorpay, and schedule online sessions.
- **Chat System**: Secure messaging for users to communicate with psychologists after booking a session.
- **Video Calls**: Integrated Zego video call API for online consultations.
- **Review System**: Users can provide feedback and book additional sessions.
- **Authentication & Authorization**:
  - User authentication using Django Simple JWT (Access & Refresh Tokens).
  - Google authentication with Django AllAuth & Django Rest Auth.
- **Admin Dashboard**:
  - Built with ShadCN and Tailwind CSS.
  - Admin approval system for psychologist registration.
  - User and psychologist management.


## Tech Stack
### Frontend
- React
- Redux (for global state management)
- React Hook Form & Zod (for form validation)
- Tailwind CSS & ShadCN (for UI styling)

### Backend
- Django REST Framework
- Django Simple JWT (for authentication & authorization)
- Django AllAuth & Django Rest Auth (for Google authentication)
- PostgreSQL (Database)
- Cloudinary (for media storage)

### Integrations
- Razorpay (for payments)
- Zego Prebuilt UI (for video calls)

## Installation & Setup
### Prerequisites
- Node.js & npm (for frontend)
- Python & pip (for backend)
- PostgreSQL database

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/bithulmb/MindHeal.git
   cd Mindheal/backend
   ```
2. Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Apply migrations:
   ```sh
   python manage.py migrate
   ```
5. Start the server:
   ```sh
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd Mindheal/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, reach out to **Bithul Krishna** at **bithulmb@gmail.com**.

