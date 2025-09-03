# Custom Onboarding Flow (Spring Boot + Next.js)

**Features**
- Three-step wizard: Account → Page 2 → Page 3
- Page 2 & 3 are admin-configurable: choose any of **About Me**, **Address**, **Birthdate**
- Progress is persisted server-side; users who return (cookie `uid`) resume where they left off
- `/admin` (no auth) to configure which components appear on each page (2 & 3 must each have ≥1)
- `/data` publicly shows a live table of user data (for testing)
- Spring Boot 3 backend (H2 by default; switchable to Postgres), Next.js 14 frontend

---

## Local Setup

### Backend
Requirements: Java 17, Maven
```bash
cd backend
mvn spring-boot:run    # or: mvn spring-boot:run
```
The backend runs at `http://localhost:8080` and uses H2 (file) for easy persistence during dev.
- H2 console at `http://localhost:8080/h2-console` (JDBC: `jdbc:h2:file:./data/onboarding`)

To allow the frontend:
- CORS origin defaults to `http://localhost:3000` (override with env `APP_FRONTEND_ORIGIN`).

### Frontend
Requirements: Node 18+
```bash
cd frontend
npm install
export NEXT_PUBLIC_API_BASE=http://localhost:8080
npm run dev
```
Visit:
- Onboarding Wizard: `http://localhost:3000/`
- Admin Config: `http://localhost:3000/admin`
- Data Table: `http://localhost:3000/data`

---

## Production / Demo Deployment

**Backend (Render / Railway)**
- Build the Spring Boot JAR and deploy. Set env:
  - `APP_FRONTEND_ORIGIN` = your deployed frontend origin (e.g., `https://your-frontend.vercel.app`)
- For Postgres, set:
  - `SPRING_DATASOURCE_URL=jdbc:postgresql://...`
  - `SPRING_DATASOURCE_USERNAME=...`
  - `SPRING_DATASOURCE_PASSWORD=...`
  - Add dependency for Postgres driver if needed (and remove H2):
    ```xml
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    ```

**Frontend (Vercel)**
- Set `NEXT_PUBLIC_API_BASE` to your backend URL.
- Redeploy. The wizard, admin, and data pages should connect to the backend.

---

## Notes & Trade-offs
- For this exercise, auth is intentionally minimal. We store `uid` in a non-HTTPOnly cookie to re-identify the user and restore their step. In a real app, use secure, HttpOnly, SameSite cookies with a session/token.
- Admin prevents empty pages and duplicate components per page. Ordering within a page was excluded by prompt.
- You can A/B test different component layouts simply by changing Admin config.
- Styles: Tailwind with a modern dark glassmorphism aesthetic.

Good luck with the demo & submission!
