Build a Marketing & Sales Admin Dashboard using Next.js 14 (App Router), 
Tailwind CSS, and Supabase.

AUTH & ROLES:
- Supabase Auth (email/password, JWT)
- Roles: Admin, Manager (web only)
- Protect all routes with middleware
- Role stored in users table, checked via RLS

DATABASE (Supabase PostgreSQL):
Tables:
- users: id, name, email, role, created_at
- field_visits: id, user_id, company, contact, phone, email, 
  visit_date, status (interested/not_interested/follow_up), notes, created_at
- sales: id, user_id, customer, service, price, sale_date, created_at
- leads: id, visit_id, status (lead/converted/lost), updated_at

PAGES & FEATURES:
1. /login — email/password login form
2. /dashboard — overview cards: total visits, total sales, 
   total revenue, active employees
3. /visits — table of all field visits, filter by date/status/user
4. /sales — table of all sales, filter by date/user, auto-sum revenue
5. /leads — kanban or table: lead → converted → lost
6. /employees — list of users, their KPIs (visits/day, sales count, revenue)
7. /reports — daily/weekly/monthly breakdown, exportable
8. /users — Admin only: create/edit/delete users, assign roles

REALTIME:
- Subscribe to Supabase Realtime on visits and sales tables
- Dashboard cards update live without page refresh

UI:
- Clean sidebar layout, dark or light theme
- Responsive for desktop browsers
- Use shadcn/ui or Tailwind components

ENV:
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key