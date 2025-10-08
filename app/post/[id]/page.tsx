"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, HeartCrack, ExternalLink, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DisputeModal from "@/components/dispute-modal";

interface Card {
  id: number;
  name: string;
  type: string;
  industry: string | null;
  country: string;
  side: string;
  description: string;
  links: string[] | null;
  imageUrl: string | null;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [voting, setVoting] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [linkTitles, setLinkTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchCard();
    fetchUserVote();
  }, [cardId]);

  // Fetch link titles when card is loaded
  useEffect(() => {
    if (card?.links && card.links.length > 0) {
      fetchLinkTitles(card.links);
    }
  }, [card?.links]);

  const fetchLinkTitles = async (links: string[]) => {
    const titles: { [key: string]: string } = {};

    for (const link of links) {
      try {
        // Use our API route to fetch the page title (avoids CORS issues)
        const response = await fetch(`/api/fetch-title?url=${encodeURIComponent(link)}`);
        const data = await response.json();

        if (data.title) {
          titles[link] = data.title;
        }
      } catch (error) {
        console.error(`Failed to fetch title for ${link}:`, error);
        // Keep domain as fallback
      }
    }

    setLinkTitles(titles);
  };

  const fetchCard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cards");
      const cards = await response.json();
      const foundCard = cards.find((c: Card) => c.id.toString() === cardId);

      if (foundCard) {
        setCard(foundCard);
      } else {
        setError("Card not found");
      }
    } catch (err) {
      console.error("Error fetching card:", err);
      setError("Failed to load card");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVote = async () => {
    try {
      const response = await fetch(`/api/cards/${cardId}/vote`);
      if (response.ok) {
        const data = await response.json();
        setUserVote(data.voted ? data.voteType : null);
      }
    } catch (err) {
      console.error("Error fetching user vote:", err);
    }
  };

  const handleVote = async (voteType: "like" | "dislike") => {
    if (voting || !card) return;

    // Optimistic update - update UI immediately
    const previousVote = userVote;
    const previousCard = { ...card };

    // Calculate new vote counts optimistically
    let newLikes = card.likes;
    let newDislikes = card.dislikes;

    if (previousVote === voteType) {
      // Removing vote
      if (voteType === "like") {
        newLikes = Math.max(0, card.likes - 1);
      } else {
        newDislikes = Math.max(0, card.dislikes - 1);
      }
      setUserVote(null);
    } else {
      // Adding or changing vote
      if (previousVote === "like") {
        newLikes = Math.max(0, card.likes - 1);
      } else if (previousVote === "dislike") {
        newDislikes = Math.max(0, card.dislikes - 1);
      }

      if (voteType === "like") {
        newLikes += 1;
      } else {
        newDislikes += 1;
      }
      setUserVote(voteType);
    }

    // Update UI immediately
    setCard({
      ...card,
      likes: newLikes,
      dislikes: newDislikes,
    });

    // Send request to backend
    try {
      setVoting(true);
      const response = await fetch(`/api/cards/${cardId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        // Update with actual data from server
        const updatedCard = await response.json();
        setCard(updatedCard);
      } else {
        // Revert on error
        setCard(previousCard);
        setUserVote(previousVote);
      }
    } catch (err) {
      console.error("Error voting:", err);
      // Revert on error
      setCard(previousCard);
      setUserVote(previousVote);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{error || "Card not found"}</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const borderColor = card.side === "bad"
    ? "border-red-300 dark:border-red-700"
    : "border-green-300 dark:border-green-700";
  const bgColor = card.side === "bad"
    ? "bg-red-50 dark:bg-red-950/20"
    : "bg-green-50 dark:bg-green-950/20";

  return (
    <div className="min-h-screen p-4 sm:p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Button>

        {/* Article Card */}
        <article className={`${bgColor} border-2 ${borderColor} rounded-2xl overflow-hidden`}>
          {/* Hero Image */}
          <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-neutral-800">
            <img
              src={card.imageUrl || "https://images.unsplash.com/photo-1485348616965-15c926318fbb?q=80&w=560&auto=format&fit=crop"}
              alt={card.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={card.type === "person" ? "default" : "secondary"}>
                  {card.type === "person" ? "Person" : "Organization"}
                </Badge>
                {card.industry && (
                  <Badge variant="outline">
                    {card.industry}
                  </Badge>
                )}
                <Badge variant={card.side === "bad" ? "destructive" : "default"}>
                  {card.side === "bad" ? "Bad Guy" : "Good Guy"}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-neutral-100">
                {card.name}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{card.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Voting Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <Button
                  variant={userVote === "like" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleVote("like")}
                  disabled={voting}
                  className="flex items-center gap-2"
                >
                  <Heart size={20} className={userVote === "like" ? "fill-current" : ""} />
                  <span>{card.likes}</span>
                </Button>
                <Button
                  variant={userVote === "dislike" ? "destructive" : "outline"}
                  size="lg"
                  onClick={() => handleVote("dislike")}
                  disabled={voting}
                  className="flex items-center gap-2"
                >
                  <HeartCrack size={20} className={userVote === "dislike" ? "fill-current" : ""} />
                  <span>{card.dislikes}</span>
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-neutral-300">
                {card.description}
              </p>
            </div>

            {/* Sources */}
            {card.links && card.links.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
                  Sources & References ({card.links.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {card.links.map((link: string, index: number) => {
                    // Extract domain name for fallback
                    let domain = "";
                    try {
                      const url = new URL(link);
                      domain = url.hostname.replace("www.", "");
                    } catch {
                      domain = "External Source";
                    }

                    // Use fetched title or domain as fallback
                    const title = linkTitles[link] || domain;

                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-gray-200 dark:border-neutral-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-neutral-100 line-clamp-2">
                              {title}
                            </h3>
                            <ExternalLink size={16} className="flex-shrink-0 text-gray-500" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {domain}
                          </p>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 break-all line-clamp-1">
                            {link}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dispute Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-neutral-700">
              <Button
                onClick={() => setIsDisputeModalOpen(true)}
                className="bg-black text-white hover:bg-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900"
              >
                Dispute Classification
              </Button>
            </div>
          </div>
        </article>
      </div>

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        cardId={cardId}
        cardName={card.name}
      />
    </div>
  );
}
