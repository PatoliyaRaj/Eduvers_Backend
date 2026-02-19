## Adding Password Hashing in Model 🔐

---

## Tenant Model (Complete Code)

```javascript
const { DataTypes } = require("sequelize");
const { sequelize } = require("../Db/sequelize");
const bcrypt = require("bcrypt");

const Tenant = sequelize.define(
    "Tenant",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "phone_no",
        },
        orgOwnerName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "org_owner_name",
        },
        orgOwnerEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
            field: "org_owner_email",
        },
        orgOwnerPhone: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "org_owner_phone",
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        agreeTerms: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "agree_terms",
        },
        about: {
            type: DataTypes.TEXT,
            defaultValue: "",
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "refresh_token",
        },
    },
    {
        tableName: "tenants",
        timestamps: true,
        underscored: true,

        // ✅ Add Hooks Here
        hooks: {
            // Before Creating New Tenant
            beforeCreate: async (tenant) => {
                if (tenant.password) {
                    const salt = await bcrypt.genSalt(10);
                    tenant.password = await bcrypt.hash(tenant.password, salt);
                }
            },

            // Before Updating Tenant
            beforeUpdate: async (tenant) => {
                // Only hash if password was changed
                if (tenant.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    tenant.password = await bcrypt.hash(tenant.password, salt);
                }
            },
        },
    },
);

// ✅ Add Method to Compare Password
Tenant.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = Tenant;
```

---

## User Model (Complete Code)

```javascript
const { DataTypes } = require("sequelize");
const { sequelize } = require("../Db/sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "tenant_id",
            references: {
                model: "tenants",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        userType: {
            type: DataTypes.ENUM("student", "teacher", "admin"),
            allowNull: false,
            field: "user_type",
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "first_name",
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "last_name",
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM("male", "female"),
            allowNull: false,
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "phone_no",
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        agreeTerms: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "agree_terms",
        },
        about: {
            type: DataTypes.TEXT,
            defaultValue: "",
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "refresh_token",
        },
    },
    {
        tableName: "users",
        timestamps: true,
        underscored: true,

        // ✅ Add Hooks Here
        hooks: {
            // Before Creating New User
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },

            // Before Updating User
            beforeUpdate: async (user) => {
                // Only hash if password was changed
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    },
);

// ✅ Add Method to Compare Password
User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
```

---

## How to Use comparePassword in Login

```javascript
// controllers/authController.js

// Tenant Login
const tenantLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find Tenant
        const tenant = await Tenant.findOne({ where: { email } });

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }

        // ✅ Compare Password using our method
        const isMatch = await tenant.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// User Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ✅ Compare Password using our method
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
```

---

## How it Works 🔄

```
Register/Create
     │
     ▼
┌─────────────────────────┐
│  password = "hello123"  │  ← Plain text password
└─────────────────────────┘
     │
     ▼ beforeCreate Hook
┌─────────────────────────────────────────┐
│  password = "$2b$10$xyz..."             │  ← Hashed password
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Saved in Database      │  ← Only hashed password stored
└─────────────────────────┘


Login
     │
     ▼
┌─────────────────────────┐
│  enteredPassword        │  ← Plain text from user
└─────────────────────────┘
     │
     ▼ comparePassword()
┌─────────────────────────┐
│  bcrypt.compare()       │  ← Compare with hashed password
└─────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  true or false          │  ← Match result
└─────────────────────────┘
```

---

## Install bcrypt

```bash
npm install bcrypt
```

---

## Summary

| Hook | When it runs | What it does |
|------|-------------|--------------|
| `beforeCreate` | On new record | Hash password before saving |
| `beforeUpdate` | On update | Hash only if password changed |
| `comparePassword` | On login | Compare plain vs hashed password |

Do you want me to show the **complete auth flow** with JWT tokens? 😊









*********************************************************************************************

Now let me implement everything. Starting with the middleware fix, then all the new files, then updating existing files:

Now update tenantService.js to accept a userType parameter (for bootstrap), and update tenantController.js with smart first-tenant detection:

Now create the SuperAdmin service, controller, and routes:

Now let me also remove the getAllTenants route from tenantRoutes.js (since it's moved to superAdminRoutes) and clean up the tenantController by removing getAllTenants from its exports (it's now in superAdminController):

Let me verify everything compiles cleanly:

Checked authMiddleware.js, superAdminController.js, superAdminService.js, superAdminRoutes.js, tenantRoutes.js, tenantController.js, tenantService.js, 1 problem found

Only the pre-existing casing inconsistency (../Models/User vs ../models/User) — not introduced by my changes. Everything else is clean.

All done. Here's the complete picture of how it works now:

How SuperAdmin Is Handled — Complete Flow
Bootstrap (First Time Setup)
After First SuperAdmin Exists
Login (Same For Everyone)
Who Can Do What
Action	Who	Route
First registration	Anyone (public)	POST /Tenant/Register
Create new tenants	SuperAdmin only	POST /Tenant/Register
Create users	Tenant owner (admin/superadmin from tenants table)	POST /User/Signup
View all tenants	SuperAdmin	GET /SuperAdmin/Tenants
View tenant + users	SuperAdmin	GET /SuperAdmin/Tenant/:id
Promote to superadmin	SuperAdmin	PATCH /SuperAdmin/Promote/:id
Demote superadmin	SuperAdmin	PATCH /SuperAdmin/Demote/:id
Suspend/activate tenant	SuperAdmin	PATCH /SuperAdmin/Status/:id
View all platform users	SuperAdmin	GET /SuperAdmin/Users
Dashboard stats	SuperAdmin	GET /SuperAdmin/Stats
Update own profile	Tenant owner (self)	PATCH /Tenant/Update/:id
New Files Created
superAdminService.js — 7 platform-level operations
superAdminController.js — 7 controller methods
superAdminRoutes.js — all locked with authenticate → isTenantOwner → authorize("superadmin")
Safety Guards Built In
Cannot demote yourself
Cannot demote the last superadmin
Cannot suspend another superadmin (demote first)
Cannot change your own status
Suspending a tenant force-clears their tokens (instant logout)
User-level "admin" (from users table) cannot create users or access tenant/superadmin routes (isTenantOwner blocks them)

how smart registration works now
POST /Tenant/Register  (no auth needed — 0 tenants in DB)
  ↓
  tenantRoutes.js → smartRegisterAuth middleware checks Tenant.count()
  ↓ count === 0 → skips auth
  tenantService.createTenant() → detects count === 0 → sets userType: "superadmin"
  ↓
  Returns JWT tokens → SuperAdmin is logged in immediately after first registration


 After First SuperAdmin Exists
POST /Tenant/Register  (requires superadmin auth)
  ↓
  smartRegisterAuth → count > 0 → chains authenticate + authorize("superadmin")
  ↓
  Creates new tenant with userType: "admin"

Login (Same For Everyone)
POST /Auth/Login  { email, password }
  ↓
  authService → checks Tenant table first → then User table
  ↓
  Returns: { tokens, user: { userType, role: "tenant" | "user" } }





Safety Guards Built In
Cannot demote yourself
Cannot demote the last superadmin
Cannot suspend another superadmin (demote first)
Cannot change your own status
Suspending a tenant force-clears their tokens (instant logout)
User-level "admin" (from users table) cannot create users or access tenant/superadmin routes (isTenantOwner blocks them)



Who Can Do What
Action	Who	Route
First registration	Anyone (public)	POST /Tenant/Register
Create new tenants	SuperAdmin only	POST /Tenant/Register
Create users	Tenant owner (admin/superadmin from tenants table)	POST /User/Signup
View all tenants	SuperAdmin	GET /SuperAdmin/Tenants
View tenant + users	SuperAdmin	GET /SuperAdmin/Tenant/:id
Promote to superadmin	SuperAdmin	PATCH /SuperAdmin/Promote/:id
Demote superadmin	SuperAdmin	PATCH /SuperAdmin/Demote/:id
Suspend/activate tenant	SuperAdmin	PATCH /SuperAdmin/Status/:id
View all platform users	SuperAdmin	GET /SuperAdmin/Users
Dashboard stats	SuperAdmin	GET /SuperAdmin/Stats
Update own profile	Tenant owner (self)	PATCH /Tenant/Update/:id
