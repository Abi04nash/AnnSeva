# AnnSeva

AnnSeva is a full-stack food donation and management web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It helps reduce food wastage by connecting individual donors with NGOs and food banks, where individual donors can register and post food donations collected from restaurants, hotels, or events. NGOs and food banks can view and request these donations for redistribution to underprivileged people. The platform ensures transparency, real-time updates, and a seamless donation process for all users.

### 🌐 Live Demo
🔗 [Visit AnnSeva](#) *(https://annseva-edbw.onrender.com/)*

---

### How AnnSeva Works
AnnSeva follows a simple and real-world food donation workflow:
1. **Donor Registration:** Restaurants, hotels, event organizers, or individuals register as donors.
2. **Post Food Donation:** Donors post surplus food with details like quantity, pickup location, source type, and expiry (time or quantity-based).
3. **Active Donation Listing:** The donation becomes visible to nearby NGOs and food banks in real-time on an interactive map.
4. **NGO / Food Bank Applies:** NGOs or food banks browse available donations and apply for pickup.
5. **Donor Approval:** Donors review requests and accept or reject them.
6. **Food Collection & Completion:** Approved NGOs collect the food, and the donation status is updated automatically.
7. **Automatic Expiry Handling:** Donations automatically expire when time or quantity limits are reached.

### Donation Flow Diagram
    Donor
      ↓
    Post Donation
      ↓
    Donation Active
      ↓
    NGO Applies
      ↓
    Donor Accepts / Rejects
      ↓
    Food Collected
      ↓
    Donation Completed / Expired

---

### User Roles

**Donor**
- Register and post food donations (Firstly, add a source like Home, Restaurant, etc.)
- Set expiry conditions (time or quantity)
- Accept or reject NGO requests
- Track donation status

**NGO / Food Bank**
- Browse nearby food donations using dynamic filters and interactive live maps
- Update profile to add licence, phone No., location
- Can Filter donations by donation type (meals, fruits, groceries, snacks, etc.)
- Apply for available donations
- Track accepted and collected donations

---

### Features
- User Authentication (Register/Login/Logout)
- Add, Remove, Update, View, Bookmark, Request, and Manage Food Donations
- Time or quantity-based automatic donation expiry (Active/Expired)
- Categorized donations by source type
- Donor Dashboard to Accept/Reject Donation's Requests
- FoodBank Dashboard to view Applied Donations
- **Real-time Location-based Tracking (through Leaflet Map & Nominatim API)**
- **Smart Dynamic Filters powered by Redux Toolkit to show only active cities**
- **Premium Glassmorphism UI with responsive design across all devices**
- **Smart Auto-filling forms for accurate quantity and expiry management**
- Search Donation
- Fully responsive design (Mobile_Friendly)
- JWT-based Authentication
- Image Upload using Cloudinary

---

### Tech Stack

**Frontend:**
- React.js
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- ShadCN UI
- **Leaflet.js & React-Leaflet** *(For Interactive Maps)*

**Backend & APIs:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Cloudinary for Image Upload
- Multer for File Handling
- **OpenStreetMap Nominatim API** *(For Address Geocoding)*
