# Zobda Admin System Guide

## Overview
The admin system allows you to manage default products that new users will automatically see in their "Your Price Watches" section when they sign up.

## Accessing Admin Dashboard

### Secret Access Methods (Hidden from Users)

1. **Keyboard Sequence**: Type "zobdaadmin" anywhere on the site
2. **Logo Click Sequence**: Click the "Z" logo 5 times quickly (within 3 seconds)
3. **Secret URL**: Visit `/zobda-admin` directly
4. **Regular URL**: Visit `/admin` (requires authentication)

### Authentication
- **Password**: `zobda_admin_2024`
- **Session**: Stored in localStorage for convenience
- **Logout**: Available in admin dashboard

## Managing Default Products

### Current Default Products
- View all products currently set as defaults for new users
- See product count and details
- Remove products from the default list

### Adding New Products
1. Click "Add Products" button
2. Search through available products using the search bar
3. Click "Add" next to any product to add it to the default list
4. Products already in the default list will show "Added" and be disabled

### Removing Products
1. In the "Current Default Products" section
2. Click "Remove" next to any product
3. The product will be removed from the default list

## How It Works

### For New Users
- When a new user visits the site, they automatically get the default products in their watchlist
- This happens in both the HomePage and WatchlistPage
- The system uses `localStorage` to persist the watchlist

### For Existing Users
- Existing users are not affected by changes to the default list
- Their current watchlist remains unchanged
- Only new users get the updated default products

### Data Storage
- Default products are stored in `localStorage` with key `zobda_default_products`
- User watchlists are stored in `localStorage` with key `zobda_watchlist`
- The system automatically syncs default products to new user watchlists

## Security

### Admin Authentication
- Simple password-based authentication
- Session stored in `localStorage`
- Password: `zobda_admin_2024` (change in production)

### Production Considerations
- Change the admin password to a secure value
- Store password as environment variable
- Implement proper user authentication system
- Add role-based access control
- Use secure session management

## Technical Details

### Files Created
- `src/services/defaultProducts.ts` - Default products management service
- `src/modules/admin/AdminDashboard.tsx` - Admin interface
- `src/modules/admin/AdminAuth.tsx` - Authentication component
- `src/modules/admin/ProtectedAdminRoute.tsx` - Protected route wrapper

### Integration Points
- `HomePage.tsx` - Initializes new users with default products
- `WatchlistPage.tsx` - Syncs default products for new users
- `main.tsx` - Admin route configuration
- `AppLayout.tsx` - Admin navigation link

## Usage Examples

### Adding Popular Products
1. Go to Admin Dashboard
2. Search for "iPhone" or "MacBook"
3. Add trending products to default list
4. New users will see these products automatically

### Seasonal Updates
1. Add holiday-specific products before Black Friday
2. Remove seasonal products after the season
3. Keep evergreen products that are always popular

### Testing
1. Clear your browser's localStorage
2. Visit the homepage
3. Check "Your Price Watches" section
4. Verify default products appear

## Troubleshooting

### Products Not Appearing
- Check if products are added to default list
- Verify localStorage is working
- Check browser console for errors

### Admin Access Issues
- Ensure correct password is entered
- Check if admin session is stored in localStorage
- Clear localStorage and try again

### Sync Issues
- Default products only affect new users
- Existing users keep their current watchlist
- Changes take effect for new visitors only
