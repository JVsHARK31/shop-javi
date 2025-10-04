# Login Credentials - Javier_shark006 Shop

## Admin Login

### How to Access Admin Panel

1. **Open Admin Login Page:**
   - URL: `/admin/login`
   - Or click "Admin" button in the header

2. **Login Credentials:**
   ```
   Email:    javier@admin.com
   Password: [Your password]
   ```

   **Note:** The password was set when the admin user was created in Supabase Auth.

3. **After Login:**
   - You will be redirected to `/admin/dashboard`
   - From there you can access:
     - Dashboard (overview & statistics)
     - Products (manage products)
     - Categories (manage categories)
     - Settings (system settings)

---

## System Architecture

### Authentication System

**Using:** Supabase Auth (Official)

**How it works:**
1. Login form submits email + password
2. `signInAdmin()` calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials
4. Returns session token
5. Token stored in browser
6. All admin pages check auth status via `checkAdminAuth()`
7. If not authenticated → redirect to `/admin/login`

**Files:**
- `/app/admin/login/page.tsx` - Login UI
- `/lib/auth-helpers.ts` - Auth functions
- `/components/admin/admin-layout.tsx` - Auth wrapper

---

## If You Forgot Password

### Option 1: Reset via Supabase Dashboard

1. Go to Supabase Dashboard
2. Navigate to Authentication → Users
3. Find user: `javier@admin.com`
4. Click on user
5. Click "Reset Password"
6. Check email for reset link

### Option 2: Create New Admin User

Run this SQL in Supabase SQL Editor:

```sql
-- Note: You need to create user via Supabase Dashboard first
-- Authentication → Users → Add User
-- Then the user will appear in auth.users table
```

**Steps in Dashboard:**
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password
4. User is created and can login immediately

---

## Current Admin User

**Email:** `javier@admin.com`

**Verified:** Yes (exists in auth.users table)

**Permissions:** Full admin access to:
- View and edit all products
- Create, update, delete products
- Manage categories
- Upload images
- Change settings
- View statistics

---

## Testing Login

### Test Procedure:

1. **Navigate to login:**
   ```
   http://localhost:3000/admin/login
   or
   https://your-domain.com/admin/login
   ```

2. **Enter credentials:**
   - Email: `javier@admin.com`
   - Password: [your password]

3. **Click "Login" button**

4. **Expected result:**
   - Toast notification: "Login berhasil!"
   - Redirect to `/admin/dashboard`
   - See dashboard with statistics

5. **If login fails:**
   - Check error message in toast
   - Verify credentials are correct
   - Check browser console for errors
   - Verify Supabase connection in .env

---

## Security Features

### Implemented Security:

✅ **Password Authentication**
- Using Supabase Auth (industry standard)
- Passwords hashed with bcrypt
- Never stored in plain text

✅ **Session Management**
- JWT tokens for sessions
- Secure httpOnly cookies
- Auto-refresh tokens

✅ **Route Protection**
- All admin routes require authentication
- Middleware checks auth status
- Auto-redirect to login if not authenticated

✅ **Logout Functionality**
- Clear session on logout
- Redirect to homepage
- Remove all auth tokens

---

## Troubleshooting

### Problem: "Email atau password salah"

**Possible causes:**
1. Incorrect email or password
2. User doesn't exist in Supabase Auth
3. Email not verified (if required)

**Solutions:**
1. Double-check credentials
2. Verify user exists in Supabase Dashboard
3. Reset password if needed
4. Check browser console for detailed error

---

### Problem: Redirects to login immediately after login

**Possible causes:**
1. Auth state not persisting
2. Browser blocking cookies
3. Session storage issues

**Solutions:**
1. Check browser console for errors
2. Enable cookies in browser settings
3. Try incognito/private mode
4. Clear browser cache and try again

---

### Problem: Can't access admin pages

**Possible causes:**
1. Not logged in
2. Session expired
3. Auth middleware blocking access

**Solutions:**
1. Login again at `/admin/login`
2. Check if cookies are enabled
3. Verify Supabase connection
4. Check browser console for errors

---

## Admin Panel Features

### Dashboard (`/admin/dashboard`)
- View total products
- See published products count
- Check low stock alerts
- Quick start guide

### Products (`/admin/products`)
- List all products
- Create new products
- Edit existing products
- Delete products
- Upload product images (up to 4 images)
- Manage product variations
- Set prices and stock
- Toggle published status

### Categories (`/admin/categories`)
- View all categories
- Add new categories
- Edit category names
- Delete unused categories
- Auto-generate slugs

### Settings (`/admin/settings`)
- System configuration
- WhatsApp number for orders
- Contact information
- Store settings

---

## Important Notes

⚠️ **Keep Credentials Secure:**
- Never share admin password
- Don't commit passwords to Git
- Use strong passwords
- Change password regularly

⚠️ **Production Deployment:**
- Use environment variables for sensitive data
- Enable HTTPS (SSL/TLS)
- Set up proper CORS policies
- Use Supabase production instance

⚠️ **Backup:**
- Regularly backup database
- Export products data
- Keep copy of images
- Document all changes

---

## Quick Reference

```bash
# Admin Login URL
/admin/login

# Current Admin Email
javier@admin.com

# After Login
→ /admin/dashboard

# Admin Routes
/admin/dashboard    # Overview & stats
/admin/products     # Product management
/admin/categories   # Category management
/admin/settings     # System settings

# Logout
Click "Logout" button in sidebar/header
→ Redirects to homepage (/)
```

---

## Need Help?

If you're still having issues:

1. Check Supabase Dashboard for user status
2. Verify .env file has correct values
3. Check browser console for errors
4. Test Supabase connection
5. Try creating a new admin user

**Supabase Dashboard:**
- URL: https://app.supabase.com
- Project: Your project
- Check: Authentication → Users

---

**System Status:** ✅ Working
**Auth System:** ✅ Supabase Auth
**Admin User:** ✅ javier@admin.com (exists)
**Ready:** ✅ For production use
