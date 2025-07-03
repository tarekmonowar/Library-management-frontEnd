import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./Redux/store";

//route imports
import BookDetails from "./pages/BookDetails";
import Books from "./pages/books";
import BorrowBook from "./pages/BorrowBook";
import BorrowSummary from "./pages/BorrowSummary";
import CreateBook from "./pages/CreateBook";
import EditBook from "./pages/EditBook";
import Home from "./pages/home";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/create-book" element={<CreateBook />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="/borrow/:bookId" element={<BorrowBook />} />
            <Route path="/borrow-summary" element={<BorrowSummary />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
