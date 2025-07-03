import { useGetBorrowSummaryQuery } from "@/Redux/Api/libraryApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, BookOpen, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

const BorrowSummary = () => {
  const { data, isLoading, error } = useGetBorrowSummaryQuery();

  const borrowSummary = data?.summary;

  // console.log(borrowSummary);
  if (error) {
    toast.error("Failed to fetch borrow summary. Please try again later.");
    toast.error(`Error: ${error}`);
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8  bg-gray-900 border-gray-800  rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className=" bg-gray-700 border-gray-800  rounded-lg shadow p-6"
                >
                  <div className="h-16  bg-gray-700 border-gray-800  rounded"></div>
                </div>
              ))}
            </div>
            <div className=" bg-gray-900 border-gray-800  rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8  bg-gray-700 border-gray-800  rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalBooks = borrowSummary?.length || 0;
  const totalCopiesBorrowed =
    borrowSummary?.reduce((sum, item) => sum + item.totalQuantity, 0) || 0;
  const mostBorrowedBook = borrowSummary?.length
    ? borrowSummary.reduce((max, item) =>
        item.totalQuantity > max.totalQuantity ? item : max,
      )
    : null;

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-200">
            Borrow Summary
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Total Books Borrowed
                  </p>
                  <p className="text-3xl font-bold text-gray-200 mt-8">
                    {totalBooks}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Total Copies
                  </p>
                  <p className="text-3xl font-bold text-gray-200 mt-8">
                    {totalCopiesBorrowed}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Borrowed Book Highlight */}
        {mostBorrowedBook && (
          <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6 mb-10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-200 mb-3">
                    Most Borrowed Book
                  </h3>
                  <p className="text-gray-300">
                    "{mostBorrowedBook.book.title}" with{" "}
                    {mostBorrowedBook.totalQuantity} copies borrowed
                  </p>
                </div>
                <Badge className="text-lg px-4 py-2">
                  {mostBorrowedBook.totalQuantity} copies
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Borrowing Summary Table */}
        <Card className="bg-gray-900 border border-gray-800  hover:border-blue-500 transition-colors rounded-lg p-6 mb-10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-100" />
              <span className="text-gray-200">Detailed Borrow Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!borrowSummary || borrowSummary.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  No Borrowed Books
                </h3>
                <p className="text-gray-200 mb-6">
                  No books have been borrowed yet. Start borrowing to see
                  statistics here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-800 border-gray-800 text-xl">
                      <TableHead className="font-bold text-gray-200 ">
                        Book Title
                      </TableHead>
                      <TableHead className="font-bold text-gray-200 text-center">
                        ISBN
                      </TableHead>
                      <TableHead className="font-bold text-gray-200 text-center">
                        Total Quantity Borrowed
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...borrowSummary]
                      .sort((a, b) => b.totalQuantity - a.totalQuantity)
                      .map((item, index) => (
                        <TableRow
                          key={item.book.isbn}
                          className="hover:bg-gray-800 border-gray-800 "
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Badge variant="default" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <span className="text-gray-100">
                                {item.book.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-gray-200 text-center">
                            {item.book.isbn}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className=" font-extrabold text-gray-200">
                              {item.totalQuantity}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorrowSummary;
