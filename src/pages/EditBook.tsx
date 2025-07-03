import {
  useGetBookDetailsQuery,
  useUpdateBookMutation,
} from "@/Redux/Api/libraryApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading: isLoadingBook } = useGetBookDetailsQuery(id!);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const book = data?.book || null;
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    description: "",
    copies: 1,
    available: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        description: book.description || "",
        copies: book.copies,
        available: book.available,
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    } else if (formData.author.trim().length < 3) {
      newErrors.author = "Author must be at least 3 characters";
    }

    // Genre validation
    if (!formData.genre.trim()) {
      newErrors.genre = "Genre is required";
    }

    // ISBN validation
    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    }

    // Copies validation
    if (formData.copies < 0) {
      newErrors.copies = "Copies must be at least 1";
    }

    // Available must be true only if copies > 0
    if (formData.copies > 0 && !formData.available) {
      newErrors.available = "Book must be marked as available if copies exist";
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
      await updateBook({
        bookId: id!,
        ...formData,
      }).unwrap();
      toast.success(`"${book?.title}" has been updated successfully!`);
      navigate(`/books`);
    } catch (error) {
      toast.error("Failed to update book. Please try again.");
      toast.error(`Update book error: ${error}`);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
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
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="bg-gray-700 rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Book Not Found
              </h3>
              <p className="text-red-600 mb-4">
                The book you're trying to edit could not be found.
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
            <h1 className="text-3xl font-bold text-gray-100">Edit Book</h1>
          </div>
        </div>

        <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6 mb-10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-200">
              <Edit className="h-5 w-5" />
              <span>Book Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-200">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-gray-200">
                    Author *
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.author && (
                    <p className="text-sm text-red-600">{errors.author}</p>
                  )}
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-gray-200">
                    Genre *
                  </Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => handleChange("genre", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.genre && (
                    <p className="text-sm text-red-600">{errors.genre}</p>
                  )}
                </div>

                {/* ISBN */}
                <div className="space-y-2">
                  <Label htmlFor="isbn" className="text-gray-200">
                    ISBN *
                  </Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleChange("isbn", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.isbn && (
                    <p className="text-sm text-red-600">{errors.isbn}</p>
                  )}
                </div>

                {/* Copies */}
                <div className="space-y-2">
                  <Label htmlFor="copies" className="text-gray-200">
                    Number of Copies *
                  </Label>
                  <Input
                    id="copies"
                    type="number"
                    min="0"
                    value={formData.copies}
                    onChange={(e) =>
                      handleChange("copies", parseInt(e.target.value))
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.copies && (
                    <p className="text-sm text-red-600">{errors.copies}</p>
                  )}
                </div>

                {/* Available Switch */}
                <div className="flex items-center space-x-2 mt-7">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) =>
                      handleChange("available", checked)
                    }
                  />
                  <Label htmlFor="available" className="text-gray-200">
                    Available for borrowing
                  </Label>
                  {errors.available && (
                    <p className="text-sm text-red-600">{errors.available}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 sm:flex-initial cursor-pointer"
                >
                  {isUpdating ? <>Updating Book...</> : <>Update Book</>}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/books/${id}`)}
                  className="flex-1 sm:flex-initial text-gray-200 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditBook;
