import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "./AdminRoute";
import BooksellerRoute from "./BooksellerRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import BooksellerDashboard from "../pages/dashboard/bookseller/BooksellerDashboard";

// Import bookseller-specific components
import BooksellerLayout from "../pages/dashboard/bookseller/BooksellerLayout";
import BooksellerAddBook from "../pages/dashboard/bookseller/BooksellerAddBook";
import BooksellerManageBooks from "../pages/dashboard/bookseller/BooksellerManageBooks";
import BooksellerOrders from "../pages/dashboard/bookseller/BooksellerOrders";
import BooksellerInventory from "../pages/dashboard/bookseller/BooksellerInventory";

// Import the new dashboard pages
import InventoryPage from "../pages/dashboard/inventory/InventoryPage";
import OrdersPage from "../pages/dashboard/orders/OrdersPage";
import CustomersPage from "../pages/dashboard/customers/CustomersPage";
import AnalyticsPage from "../pages/dashboard/analytics/AnalyticsPage";
import BooksPage from "../pages/books/BooksPage";

// Import Wishlist Page
import WishlistPage from "../pages/wishlist/WishlistPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/orders",
        element: <PrivateRoute><OrderPage /></PrivateRoute>
      },
      {
        path: "/about",
        element: <div>About</div>
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/cart",
        element: <CartPage />
      },
      {
        path: "/checkout",
        element: <PrivateRoute><CheckoutPage /></PrivateRoute>
      },
      {
        path: "/books/:id",
        element: <SingleBook />
      },
      {
        path: "/books",
        element: <BooksPage />
      },
      {
        path: "/wishlist",
        element: <PrivateRoute><WishlistPage /></PrivateRoute>
      },
      {
        path: "/user-dashboard",
        element: <PrivateRoute><UserDashboard /></PrivateRoute>
      },
    ]
  },
  // ... rest of your router configuration (admin and bookseller routes)
  // Admin Dashboard Routes
  {
    path: "/admin",
    element: <AdminLogin />
  },
  {
    path: "/dashboard",
    element: <AdminRoute>
      <DashboardLayout />
    </AdminRoute>,
    children: [
      {
        path: "",
        element: <AdminRoute><Dashboard /></AdminRoute>
      },
      {
        path: "add-new-book",
        element: <AdminRoute>
          <AddBook />
        </AdminRoute>
      },
      {
        path: "edit-book/:id",
        element: <AdminRoute>
          <UpdateBook />
        </AdminRoute>
      },
      {
        path: "manage-books",
        element: <AdminRoute>
          <ManageBooks />
        </AdminRoute>
      },
      // New Dashboard Routes
      {
        path: "inventory",
        element: <AdminRoute>
          <InventoryPage />
        </AdminRoute>
      },
      {
        path: "orders",
        element: <AdminRoute>
          <OrdersPage />
        </AdminRoute>
      },
      {
        path: "customers",
        element: <AdminRoute>
          <CustomersPage />
        </AdminRoute>
      },
      {
        path: "analytics",
        element: <AdminRoute>
          <AnalyticsPage />
        </AdminRoute>
      }
    ]
  },
  // Bookseller Dashboard Routes
  {
    path: "/bookseller",
    element: <BooksellerRoute>
      <BooksellerLayout />
    </BooksellerRoute>,
    children: [
      {
        path: "",
        element: <BooksellerDashboard />
      },
      {
        path: "add-new-book",
        element: <BooksellerAddBook />
      },
      {
        path: "manage-books",
        element: <BooksellerManageBooks />
      },
      {
        path: "orders",
        element: <BooksellerOrders />
      },
      {
        path: "inventory",
        element: <BooksellerInventory />
      }
    ]
  }
]);

export default router;