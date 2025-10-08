"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import CreatePostModal from "@/components/create-post-modal";
import PostCard from "@/components/post-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Country {
  name: string;
  code: string;
}

interface Card {
  id: number;
  name: string;
  type: string;
  country: string;
  side: string;
  description: string;
  links: string[] | null;
  imageUrl: string | null;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [countries, setCountries] = useState<Country[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 30;

  // Load countries from JSON
  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountries(data.countries))
      .catch((err) => console.error("Failed to load countries:", err));
  }, []);

  // Fetch cards from database
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cards");
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards
    .filter((card) => {
      // Search filter
      if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Type filter
      if (filterType !== "all" && card.type !== filterType) {
        return false;
      }
      // Country filter
      if (filterCountry !== "all" && card.country !== filterCountry) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "likes":
          return b.likes - a.likes;
        case "dislikes":
          return b.dislikes - a.dislikes;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const paginatedCards = filteredCards.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCountry, sortBy]);

  return (
    <div className="min-h-screen p-4 sm:p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            The Great Wall
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A platform showcasing organizations and individuals on both sides of history
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
          >
            Create Post
          </Button>
        </div>

        {/* Search and Filters Section */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search by name or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="dislikes">Most Disliked</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterCountry("all");
                setSortBy("latest");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading cards...</p>
          </div>
        ) : filteredCards.length === 0 && cards.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-lg text-muted-foreground">
              No cards exist yet. Be the first to create one!
            </p>
            <Button onClick={() => setIsModalOpen(true)} size="lg">
              Create Card
            </Button>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cards found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCards.map((card) => (
                <PostCard
                  key={card.id}
                  id={card.id.toString()}
                  name={card.name}
                  type={card.type}
                  country={card.country}
                  side={card.side}
                  description={card.description}
                  links={card.links || []}
                  imageUrl={card.imageUrl}
                  likes={card.likes}
                  dislikes={card.dislikes}
                  createdAt={card.createdAt}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCardCreated={fetchCards}
      />
    </div>
  );
}