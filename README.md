# 🚀 AnnSeva - Empowering Communities to End Food Waste

**AnnSeva** is a production-grade, full-stack MERN SaaS platform designed to bridge the gap between food surplus and food scarcity. It seamlessly connects individual donors, restaurants, and event organizers with NGOs and food banks in real-time. 

Through advanced geographical mapping, dynamic state management, and an automated lifecycle for donations, AnnSeva ensures a transparent and highly efficient redistribution process.

🌐 **Live Demo:** [Visit AnnSeva](#) *(Add your deployed link here)*

---

## ✨ Key Features & Technical Highlights

- 🌍 **Real-Time Geographical Tracking:** Integrated **Leaflet.js** and **OpenStreetMap (Nominatim API)** to render live active donations on an interactive map. Implemented a smart geocoding fallback algorithm strictly scoped to Indian coordinates for maximum accuracy and speed.
- ⚡ **Dynamic State-Driven Filtering:** Engineered a dynamic location filtering system using **Redux Toolkit** and React `useMemo`. The platform automatically extracts and aggregates unique cities from active donations, capping the UI at the top 6 locations to maintain a clutter-free experience.
- 🎨 **Premium Modern UI/UX:** Designed a responsive, glassmorphism-inspired interface using **Tailwind CSS** and **ShadCN UI**. Features role-based distinct dashboards, floating layout cards, and smooth micro-interactions for a premium SaaS feel.
- ⏳ **Automated Data Integrity & Expiry:** Smart donation forms with auto-calculating workflows and read-only fallback inputs. Donations automatically transition to "Expired" based on strictly calculated time or quantity thresholds.
- 🔒 **Secure & Scalable:** JWT-based robust authentication, role-based access control (Donor vs NGO), and seamless media uploads via **Cloudinary**.

---

## 📸 Platform Previews
*(Bhai, yahan apne naye UI ke 3 mast screenshots ya GIFs upload karke link dalna zaroori hai!)*

1. **Live Map & Dynamic Filtering:** `![Map View](link_to_image)`
2. **Premium Donor Dashboard:** `![Dashboard View](link_to_image)`
3. **Smart Donation Form:** `![Form View](link_to_image)`

---

## 🔄 How AnnSeva Works

AnnSeva follows a frictionless, real-world workflow:

1. **Source Registration:** Restaurants, hotels, or individuals register as Donors and establish their pickup sources.
2. **Post Donation:** Donors list surplus food, defining exact quantities, source types, and time-based freshness limits.
3. **Live Broadcasting:** The donation goes live instantly on the Interactive Map and Browse feeds for nearby NGOs.
4. **Application Phase:** Verified NGOs/Food Banks review available listings and apply for pickup.
5. **Approval & Collection:** Donors approve the most suitable NGO request. Upon physical collection, the cycle is marked as complete.
6. **Automated Expiry:** If uncollected within the freshness window, the system automatically safely expires the listing.

### 🛣️ Donation Flow
`Post Donation` ➔ `Active Listing` ➔ `NGO Applies` ➔ `Donor Approves` ➔ `Food Collected` ➔ `Completed/Expired`

---

## 👥 User Roles

### 🫂 Donor
- Register and manage pickup sources (Home, Restaurant, Event, etc.).
- Post surplus food with automated quantity and expiry bindings.
- Review incoming NGO requests and Accept/Reject them via a dedicated Dashboard.
- Track real-time status of all historical donations.

### 🏢 NGO / Food Bank
- Maintain a verified organizational profile (Licenses, Address, Contacts).
- Explore live donations geographically via the Interactive Radar Map.
- Utilize dynamic category and location filters to find exact needs.
- Apply for active donations and track them in a dedicated "Applied/Watchlist" Dashboard.

---

## 🛠️ Tech Stack

**Frontend Architecture:**
- **React.js** (Functional Components, Hooks)
- **Redux Toolkit** (Global State Management, Memoization)
- **Tailwind CSS** & **ShadCN UI** (Styling, Glassmorphism)
- **Leaflet.js & React-Leaflet** (Interactive Maps)
- **Lucide React** (Premium Iconography)

**Backend Architecture:**
- **Node.js & Express.js** (RESTful API Design)
- **MongoDB & Mongoose** (NoSQL Database)
- **JSON Web Tokens (JWT)** (Stateless Authentication)
- **OpenStreetMap Nominatim API** (Geocoding capabilities)
- **Cloudinary & Multer** (Media storage and file handling)

---

## 💻 Local Setup

1. Clone the repository: `git clone https://github.com/your-username/AnnSeva.git`
2. Install Backend Dependencies: `cd backend && npm install`
3. Install Frontend Dependencies: `cd frontend && npm install`
4. Set up `.env` files for both frontend and backend (MongoDB URI, JWT Secret, Cloudinary keys).
5. Run the development servers:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`
