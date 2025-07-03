import {
  useDeleteBookMutation,
  useGetAllBooksQuery,
} from "@/Redux/Api/libraryApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Books = () => {
  const { data, isLoading, error } = useGetAllBooksQuery();
  // console.log(data);
  const books = data?.books || [];
  // console.log("books:", books);

  const [deleteBook] = useDeleteBookMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Function to handle book deletion
  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      await deleteBook(id).unwrap();
      toast.success(`"${title}" has been deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete book");
      toast.error(`Delete error: ${error}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle errors
  if (error) {
    toast.error("Failed to load books");
    toast.error(`Error: ${error}`);
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-900 border-gray-800 rounded w-1/4 mb-8"></div>
            <div className="bg-gray-900 border-gray-800 rounded-lg shadow">
              <div className="p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4 mb-4">
                    <div className="h-4 bg-gray-700 border-gray-800 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-700 border-gray-800 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-700 border-gray-800 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-700 border-gray-800 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h1 className="text-3xl font-bold text-white">All Books</h1>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search books..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Books List */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden p-2 ">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800">
              <TableHead className="text-white/70 font-bold text-xl py-5">
                Title
              </TableHead>
              <TableHead className="text-white/70 font-bold text-xl py-5">
                Author
              </TableHead>
              <TableHead className="text-white/70 font-bold text-xl py-5">
                Genre
              </TableHead>
              <TableHead className="text-white/70 font-bold text-xl py-5">
                ISBN
              </TableHead>
              <TableHead className="text-white/70 font-bold text-xl py-5 text-center">
                Copies
              </TableHead>
              <TableHead className="text-white/70 font-bold text-xl py-5 text-center">
                Availability
              </TableHead>
              <TableHead className="text-white/70 font-bold text-xl py-5 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  "No books available. Add some books to get started!"
                </p>
              </div>
            ) : (
              books?.map((book) => (
                <TableRow
                  key={book._id}
                  className="border-gray-800 hover:bg-gray-800"
                >
                  <TableCell className="text-white">
                    <div>
                      <div className="font-bold text-gray-200 text-[17px]">
                        {book.title}
                      </div>
                      {book.description && (
                        <div className="text-sm text-gray-300">
                          {book.description.split(" ").slice(0, 5).join(" ")}...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{book.author}</TableCell>
                  <TableCell>
                    <Badge className="text-xs text-center text-black">
                      {book.genre}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-300">
                    {book.isbn}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        book.copies > 5
                          ? "text-green-600"
                          : book.copies > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {book.copies}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={book.available ? "default" : "destructive"}>
                      {book.available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                      >
                        <Link to={`/books/${book._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                      >
                        <Link to={`/edit-book/${book._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        disabled={!book.available || book.copies === 0}
                        className="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 cursor-pointer"
                      >
                        <Link to={`/borrow/${book._id}`}>Borrow</Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent border-red-600 text-red-400 hover:bg-red-900 hover:text-black cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 border-gray-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Delete Book
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to delete "{book.title}
                              "? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-gray-600 text-gray-300  hover:text-gray-300 hover:bg-gray-800 cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(book._id, book.title)}
                              disabled={deletingId === book._id}
                              className="bg-red-600 hover:bg-red-700 cursor-pointer"
                            >
                              {deletingId === book._id
                                ? "Deleting..."
                                : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Books;
