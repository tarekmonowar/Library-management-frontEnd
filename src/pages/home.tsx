import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaggageClaim, BookOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "View All Books",
      description: "See All Books with detailed information.",
      link: "/books",
      buttonText: "View Books",
    },
    {
      icon: Plus,
      title: "Add New Book",
      description: "Add new books to the library .",
      link: "/create-book",
      buttonText: "Add Book",
    },
    {
      icon: BaggageClaim,
      title: "Borrow Summary",
      description: "Track borrowing statistics.",
      link: "/borrow-summary",
      buttonText: "View Summary",
    },
  ];

  return (
    <section>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Library Management System
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            This is my PH Level-2 Batch-5 Assignment. It's a full-featured
            solution for managing a library’s book collection, borrowing system,
            and inventory tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/books">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white/70"
            >
              <Link to="/create-book">Add Your First Book</Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Why Choose Our System?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  Easy
                </div>
                <p className="text-gray-400">
                  Simple and intuitive interface for all users
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  Fast
                </div>
                <p className="text-gray-400">
                  Quick book management and borrowing process
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  Reliable
                </div>
                <p className="text-gray-400">
                  Robust system with real-time updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-gray-900 border-gray-800 hover:border-blue-500 transition-colors"
              >
                <CardHeader className="text-center">
                  <Icon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-400">{feature.description}</p>
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Link to={feature.link}>{feature.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Index;
