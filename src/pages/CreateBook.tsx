import { useCreateBookMutation } from "@/Redux/Api/libraryApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateBook = () => {
  const navigate = useNavigate();
  const [createBook, { isLoading }] = useCreateBookMutation();

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

  //frontend form validation
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
    if (formData.copies < 1) {
      newErrors.copies = "Copies must be at least 1";
    }

    // Available must be true only if copies > 0
    if (formData.copies > 0 && !formData.available) {
      newErrors.available = "Book must be marked as available if copies exist";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await createBook(formData).unwrap();
      toast.success(`"${formData.title}" has been added successfully!`);
      navigate("/books");
    } catch (error) {
      toast.error("Failed to create book. Please try again.");
      toast.error(`Create book error: ${error}`);
    }
  };

  // Handle input changes
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white font-bold text-2xl">
            Add New Book
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Title *
                </Label>

                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <Label htmlFor="author" className="text-gray-300">
                  Author *
                </Label>

                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.author && (
                  <p className="text-sm text-red-600">{errors.author}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Genre */}
              <div>
                <Label htmlFor="genre" className="text-gray-300">
                  Genre *
                </Label>

                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => handleChange("genre", e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.genre && (
                  <p className="text-sm text-red-600">{errors.genre}</p>
                )}
              </div>

              {/* ISBN */}
              <div>
                <Label htmlFor="isbn" className="text-gray-300">
                  ISBN *
                </Label>

                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => handleChange("isbn", e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.isbn && (
                  <p className="text-sm text-red-600">{errors.isbn}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Copies */}
              <div>
                <Label htmlFor="copies" className="text-gray-300">
                  Number of Copies *
                </Label>
                <Input
                  id="copies"
                  type="number"
                  min="1"
                  required
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
              <div className="flex items-center space-x-3 text-gray-300 mt-7">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    handleChange("available", checked)
                  }
                />
                <Label htmlFor="available">Available for borrowing</Label>
                {errors.available && (
                  <p className="text-sm text-red-600">{errors.available}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);
                  if (words.length <= 100) {
                    handleChange("description", e.target.value);
                  }
                }}
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {isLoading ? <>Adding Book...</> : <>Add Book</>}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/books")}
                className="bg-transparent border-gray-600 text-gray-300 hover:text-gray-300 hover:bg-gray-800 cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBook;
