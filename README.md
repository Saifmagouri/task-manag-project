# 📌 Task Management Project

A full-stack task management application built with **Angular (frontend)** and **Spring Boot (backend)**.  
This project follows a **monorepo structure**: both the frontend and backend live in a single repository for easier collaboration and deployment.

---

## 📂 Project Structure

task-manag-project/
├── FrontStage/ # Angular application
├── stage/ # Spring Boot REST API
├── .gitignore
└── README.md



## 🚀 Features

- ✅ User authentication (login & register)  
- ✅ Role-based security (USER / ADMIN)  
- ✅ Create, edit, delete tasks  
- ✅ Mark tasks as completed or pending  
- ✅ Dashboard with task statistics  
- ✅ Responsive UI with Angular Material  
- ✅ RESTful API with Spring Boot  
- ✅ Database integration (H2/MySQL/PostgreSQL configurable)  


---

## 🛠️ Tech Stack

**Frontend**
- [Angular](https://angular.io/)  
- Angular Material (UI components)  
- RxJS & Reactive Forms  

**Backend**
- [Spring Boot](https://spring.io/projects/spring-boot) (Java 21)  
- Spring Security (JWT auth, role-based access)  
- Spring Data JPA + Hibernate  
- H2 (dev) / MySQL or PostgreSQL (prod)  


---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Saifmagouri/task-manag-project.git
cd task-manag-project
2. Backend Setup (Spring Boot)

cd backend
Run with Maven
# Windows
Backend will start at:
👉 http://localhost:8080

Default API endpoints:

POST /api/auth/register – register a user

POST /api/auth/login – authenticate and receive JWT

GET /api/tasks – fetch tasks (requires JWT)

POST /api/tasks – create a task

PUT /api/tasks/{id} – update a task

DELETE /api/tasks/{id} – delete a task

3. Frontend Setup (Angular)

cd ../frontend
npm install
ng serve
Frontend will start at:
👉 http://localhost:4200


🧪 Testing
Backend
cd backend
./mvnw test



🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feat/amazing-feature)

Commit your changes (git commit -m 'feat: add amazing feature')

Push to the branch (git push origin feat/amazing-feature)

Open a Pull Request

📜 License
This project is licensed under the MIT License – feel free to use, modify, and share.

👨‍💻 Author
Developed by Saifeddine Magouri

 Full-Stack Developer
