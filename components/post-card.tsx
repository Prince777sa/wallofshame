"use client";

import Link from "next/link";
import { Heart, HeartCrack, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisputeModal from "@/components/dispute-modal";
import { useState } from "react";

interface PostCardProps {
  id: string;
  name: string;
  type: string;
  country: string;
  side: string;
  description: string;
  links: string[];
  imageUrl: string | null;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export default function PostCard({
  id,
  name,
  type,
  country,
  side,
  description,
  links,
  imageUrl,
  likes,
  dislikes,
}: PostCardProps) {
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const borderColor = side === "bad"
    ? "border-red-300 dark:border-red-700"
    : "border-green-300 dark:border-green-700";
  const bgColor = side === "bad"
    ? "bg-red-50 dark:bg-red-950/20"
    : "bg-green-50 dark:bg-green-950/20";

  const handleDisputeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDisputeModalOpen(true);
  };

  return (
    <>
      <div className={`p-1 ${bgColor} border-2 ${borderColor} rounded-2xl hover:shadow-lg transition-shadow`}>
        <Link href={`/post/${id}`}>
          <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl dark:bg-neutral-800 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={imageUrl || "https://images.unsplash.com/photo-1485348616965-15c926318fbb?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt={name}
            />
          </div>

          <div className="p-4 space-y-5">
            <div>
              <h2 className="font-bold text-lg text-gray-800 dark:text-neutral-200">
                {name}
              </h2>

              <ul className="mt-1">
                <li className="text-sm text-gray-500 dark:text-neutral-500">
                  {type === "person" ? "Person" : "Organization"} · {country} · {side === "bad" ? "Bad Guy" : "Good Guy"}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                Description
              </h2>

              <ul className="mt-1">
                <li className="text-sm text-gray-500 dark:text-neutral-500 line-clamp-2">{description}</li>
              </ul>
            </div>

            {links && links.length > 0 && (
              <div>
                <h2 className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                  Evidence ({links.length})
                </h2>
                <div className="mt-1 flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                  <ExternalLink size={14} />
                  <span>{links.length} source{links.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-neutral-500">
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <HeartCrack size={16} />
                <span>{dislikes}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Dispute Button */}
        <div className="px-4 pb-4 flex justify-end">
          <Button
            onClick={handleDisputeClick}
            className="bg-black text-white hover:bg-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            size="sm"
          >
            Dispute
          </Button>
        </div>
      </div>

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        cardId={id}
        cardName={name}
      />
    </>
  );
}