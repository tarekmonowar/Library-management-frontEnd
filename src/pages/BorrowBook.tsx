import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetBookDetailsQuery,
  useBorrowBookMutation,
} from "@/Redux/Api/libraryApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";

const BorrowBook = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const {
    data,
    isLoading: isLoadingBook,
    error,
  } = useGetBookDetailsQuery(bookId!);
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();

  const book = data?.book || null;
  const [formData, setFormData] = useState({
    quantity: 1,
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default due date to 2 weeks from now
  useState(() => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setFormData((prev) => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split("T")[0],
    }));
  });

  if (error) {
    toast.error("Failed to load books");
    toast.error(`Error: ${error}`);
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (book && formData.quantity > book.copies) {
      newErrors.quantity = `Cannot borrow more than ${book.copies} ${
        book.copies === 1 ? "copy" : "copies"
      }`;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.dueDate);
      if (selectedDate <= today) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      // console.log("hit route");
      await borrowBook({
        bookId: bookId!,
        quantity: formData.quantity,
        dueDate: formData.dueDate,
      }).unwrap();

      toast.success(
        `Successfully borrowed ${formData.quantity} ${
          formData.quantity === 1 ? "copy" : "copies"
        } of "${book?.title}"`,
      );
      navigate("/borrow-summary");
    } catch (error: unknown) {
      let errorMessage = "Failed to borrow book. Please try again.";

      if (typeof error === "object" && error !== null && "data" in error) {
        errorMessage = (error as { data: string }).data;
      }

      toast.error(errorMessage);
      toast.error(`Borrow book error: ${error}`);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user changes input
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (isLoadingBook) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book?.available || book.copies === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6 mb-10">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Book Unavailable
              </h3>
              <p className="text-yellow-700 mb-4">
                This book is currently not available for borrowing.
              </p>
              <Button onClick={() => navigate("/books")}>Back to Books</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-200">Borrow Book</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book Information */}
          <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6 mb-10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-gray-200" />
                <span className="text-gray-200">Book Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-100">
                  {book.title}
                </h3>
                <p className="text-gray-200">by {book.author}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{book.genre}</Badge>
                <Badge variant={book.available ? "default" : "destructive"}>
                  {book.available ? "Available" : "Unavailable"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-200">ISBN:</span>
                  <span className="font-mono text-gray-200">{book.isbn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-200">Available Copies:</span>
                  <span className="font-semibold text-green-600">
                    {book.copies}
                  </span>
                </div>
              </div>

              {book.description && (
                <div>
                  <h4 className="font-medium text-gray-200 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-300 text-sm">{book.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Borrow Form */}
          <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6 mb-10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-200">
                <Calendar className="h-5 w-5" />
                <span>Borrowing Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-200">
                    Number of Copies *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={book.copies}
                    value={formData.quantity}
                    onChange={(e) =>
                      handleChange("quantity", parseInt(e.target.value))
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-600">{errors.quantity}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    Maximum: {book.copies}{" "}
                    {book.copies === 1 ? "copy" : "copies"} available
                  </p>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-gray-200">
                    Due Date *
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    min={
                      new Date(Date.now() + 86400000)
                        .toISOString()
                        .split("T")[0]
                    } // Tomorrow
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-red-600">{errors.dueDate}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    Please select a return date in the future
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-gray-950 p-4 rounded-lg">
                  <h4 className="font-medium text-green-500 mb-2">
                    Borrowing Summary
                  </h4>
                  <div className="space-y-1 text-sm text-green-500">
                    <p>Book: {book.title}</p>
                    <p>
                      Quantity: {formData.quantity}{" "}
                      {formData.quantity === 1 ? "copy" : "copies"}
                    </p>
                    {formData.dueDate && (
                      <p>
                        Due Date:{" "}
                        {new Date(formData.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isBorrowing}
                    className="flex-1 cursor-pointer"
                  >
                    {isBorrowing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 " />
                        Confirm Borrow
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/books/${bookId}`)}
                    className="flex-1 text-gray-200 cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BorrowBook;
