import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AllBooksResponse = {
  success: boolean;
  message: string;
  books: Book[];
};

interface CreateBookRequest {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export type SingleBookResponse = {
  success: boolean;
  message: string;
  book: Book;
};

export type UpdateBookRequest = {
  bookId: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type BorrowRequest = {
  bookId: string;
  quantity: number;
  dueDate: string;
};

export type BorrowSummaryItem = {
  totalQuantity: number;
  book: {
    title: string;
    isbn: string;
  };
};

export type BorrowSummaryResponse = {
  success: boolean;
  message: string;
  summary: BorrowSummaryItem[];
};

export const libraryApi = createApi({
  reducerPath: "libraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api`,
  }),
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    //get all Books endpoints
    getAllBooks: builder.query<AllBooksResponse, void>({
      query: () => "/books",
      providesTags: ["Books"],
    }),

    //get book details endpoints
    getBookDetails: builder.query<SingleBookResponse, string>({
      query: (id) => `/books/${id}`,
      providesTags: ["Books"],
    }),

    //create new book endpoints
    createBook: builder.mutation<MessageResponse, CreateBookRequest>({
      query: (bookData) => ({
        url: `/books`,
        method: "POST",
        body: bookData,
      }),
      invalidatesTags: ["Books"],
    }),

    //update book details endpoints

    updateBook: builder.mutation<MessageResponse, UpdateBookRequest>({
      query: ({ bookId, ...bookData }) => ({
        url: `/books/${bookId}`,
        method: "PUT",
        body: bookData,
      }),
      invalidatesTags: ["Books"],
    }),

    //delete book endpoints
    deleteBook: builder.mutation<MessageResponse, string>({
      query: (bookId) => ({
        url: `/books/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),

    // Borrow endpoints
    borrowBook: builder.mutation<MessageResponse, BorrowRequest>({
      query: ({ bookId, quantity, dueDate }) => ({
        url: `/borrow`,
        method: "POST",
        body: { bookId, quantity, dueDate },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Books"],
    }),

    // Get borrow summary endpoints
    getBorrowSummary: builder.query<BorrowSummaryResponse, void>({
      query: () => `/borrow`,
      providesTags: ["Books"],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useGetBookDetailsQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = libraryApi;
