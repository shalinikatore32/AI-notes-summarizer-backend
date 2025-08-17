# 📌 AI Meeting Notes Summarizer – Backend  

This is the **backend service** for the AI Meeting Notes Summarizer application.  
It is built with **Node.js + Express** and provides REST APIs for handling user requests, generating AI-powered summaries, and integration with the frontend.  

---

## 🚀 Features  

- ✨ **RESTful API** built with Express.js  
- 🔒 **Environment variable**–based configuration  
- 📩 **Email sending support** with Nodemailer  
- 🌍 **CORS support** for secure frontend-backend communication  
- 📑 **AI-powered meeting notes summarization** (Groq API)  
- 🛠️ **Production-ready deployment** (supports Render)  

---

🏗️ Tech Stack
Backend Framework: Node.js, Express.js
AI Model API: Groq API
Mailing Service: Nodemailer with Gmail
Deployment: Render


⚙️ Installation & Setup
1. Clone the Repository
   ```bash
   git clone https://github.com/your-username/AI-notes-summarizer-backend.git
   cd ai-meeting-notes-backend

2. Install dependencies
   ```bash
   npm install

3. Setup environment variables
   Create a .env file in the root of the backend folder:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=https://your-frontend-domain.com

4. Run the server locally
   ```bash
   npm start

5. Deployment
  1. When deploying (Render / Railway / Heroku), ensure you:
       Add all environment variables in the hosting platform
       Use the provided start script from package.json:
       ```bash
    "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
    }
   
