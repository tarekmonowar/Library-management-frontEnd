import { useGetBookDetailsQuery } from "@/Redux/Api/libraryApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Copy,
  Edit,
  FileText,
  Tag,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  // console.log(id);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetBookDetailsQuery(id!);
  const book = data?.book || null;

  if (error) {
    toast.error("Failed to load books");
    toast.error(`Error: ${error}`);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="bg-gray-900 rounded-lg shadow p-6">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-gray-800">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Book Not Found
              </h3>
              <p className="text-red-600 mb-4">
                The requested book could not be found.
              </p>
              <Button onClick={() => navigate("/books")}>Back to Books</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link to={`/edit-book/${book._id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Book
              </Link>
            </Button>

            {book.available && book.copies > 0 && (
              <Button asChild>
                <Link to={`/borrow/${book._id}`}>Borrow Book</Link>
              </Button>
            )}
          </div>
        </div>

        <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6 mb-10">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-gray-200 mb-2">
                  {book.title}
                </CardTitle>
                <p className="text-xl text-gray-200 mb-4">by {book.author}</p>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant={book.available ? "default" : "destructive"}
                    className="text-sm"
                  >
                    {book.available ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Unavailable
                      </>
                    )}
                  </Badge>

                  <Badge variant="secondary" className="text-sm">
                    <Tag className="h-4 w-4 mr-1" />
                    {book.genre}
                  </Badge>

                  <Badge variant="outline" className="text-sm text-gray-200">
                    <Copy className="h-4 w-4 mr-1" />
                    {book.copies} {book.copies === 1 ? "copy" : "copies"}
                  </Badge>
                </div>
              </div>

              <div className="ml-6 p-4 bg-primary/10 rounded-full">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {book.description && (
              <>
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-200 mb-3">
                    <FileText className="h-5 w-5 mr-2" />
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {book.description}
                  </p>
                </div>
                <Separator />
              </>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Book Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Author
                      </p>
                      <p className="text-gray-200">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Genre</p>
                      <p className="text-gray-200">{book.genre}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">ISBN</p>
                      <p className="text-gray-200 font-mono">{book.isbn}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Copy className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Copies
                      </p>
                      <p className="text-gray-200">{book.copies}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {book.available ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Availability Status
                      </p>
                      <p
                        className={`font-medium ${
                          book.available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {book.available
                          ? "Available for borrowing"
                          : "Currently unavailable"}
                      </p>
                    </div>
                  </div>

                  {book.createdAt && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Added to Library
                        </p>
                        <p className="text-gray-200">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {book.available && book.copies > 0 && (
              <>
                <Separator />
                <div className="bg-gray-950 p-6 rounded-lg">
                  <p className="text-green-500 mb-4">
                    This book is available with {book.copies}{" "}
                    {book.copies === 1 ? "copy" : "copies"} in stock.
                  </p>
                  <Button asChild>
                    <Link to={`/borrow/${book._id}`}>Borrow This Book</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDetails;
