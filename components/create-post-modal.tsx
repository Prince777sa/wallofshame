"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardCreated?: () => void;
}

interface Country {
  name: string;
  code: string;
}

const INDUSTRIES = [
  "Technology & Digital",
  "Finance & Business",
  "Media & Entertainment",
  "Consumer Goods & Retail",
  "Healthcare & Pharma",
  "Industrial & Manufacturing",
  "Energy & Resources",
  "Sports & Recreation",
  "Education & Research",
  "Hospitality & Travel",
  "Legal & Government",
  "Agriculture & Food",
  "Logistics & Transportation",
  "Other"
];

const FIELDS = [
  "Politics & Government",
  "Entertainment & Arts",
  "Sports & Athletics",
  "Media & Journalism",
  "Business & Finance",
  "Academia & Research",
  "Religion & Spirituality",
  "Activism & Advocacy",
  "Legal & Justice",
  "Other"
];

export default function CreatePostModal({ isOpen, onClose, onCardCreated }: CreatePostModalProps) {
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"person" | "organization" | "">("");
  const [industry, setIndustry] = useState("");
  const [side, setSide] = useState<"good" | "bad" | "">("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load countries from JSON
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountries(data.countries))
      .catch((err) => console.error("Failed to load countries:", err));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddLink = () => {
    if (links.length < 10) {
      setLinks([...links, ""]);
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "wallofshame"); // Unsigned upload preset

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dmzlakany";
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: { message: response.statusText } };
        }
        console.error("Cloudinary upload error:", errorData);
        console.error("Response status:", response.status);

        // Return null instead of throwing - we'll create the card without an image
        return null;
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload exception:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !type || !country || !side || !description) {
      setError("Name, type, country, side, and description are required");
      return;
    }

    if (!industry) {
      setError(type === "organization" ? "Industry is required for organizations" : "Field is required for persons");
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = null;
      let imageUploadFailed = false;

      if (image) {
        imageUrl = await uploadToCloudinary(image);
        if (!imageUrl) {
          imageUploadFailed = true;
          console.warn("Image upload failed, creating card without image");
        }
      }

      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          industry: industry, // Both person fields and organization industries go here
          country,
          side,
          description,
          links: links.filter((link) => link.trim() !== ""),
          imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create card");
      }

      // Show warning if image upload failed but card was created
      if (imageUploadFailed) {
        setError("Card created successfully, but image upload failed. Please set up your Cloudinary upload preset named 'wallofshame'.");
        setTimeout(() => setError(""), 5000);
      }

      // Reset form and close modal
      setCountry("");
      setImage(null);
      setName("");
      setType("");
      setIndustry("");
      setSide("");
      setDescription("");
      setLinks([""]);

      if (onCardCreated) {
        onCardCreated();
      }

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create card");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Add a new person or organization to The Great Wall
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              required
            />
          </div>

          {/* Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-destructive">*</span>
            </Label>
            <Select value={type} onValueChange={(value) => {
              setType(value as "person" | "organization");
              if (value === "person") {
                setIndustry("");
              }
            }} required>
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Dropdown - Only shown for Person */}
          {type === "person" && (
            <div className="space-y-2">
              <Label htmlFor="field">
                Field <span className="text-destructive">*</span>
              </Label>
              <Select value={industry} onValueChange={setIndustry} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select field..." />
                </SelectTrigger>
                <SelectContent>
                  {FIELDS.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Industry Dropdown - Only shown for Organizations */}
          {type === "organization" && (
            <div className="space-y-2">
              <Label htmlFor="industry">
                Industry <span className="text-destructive">*</span>
              </Label>
              <Select value={industry} onValueChange={setIndustry} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry..." />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Country Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="country">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger>
                <SelectValue placeholder="Select country..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Side Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="side">
              Side <span className="text-destructive">*</span>
            </Label>
            <Select value={side} onValueChange={(value) => setSide(value as "good" | "bad")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select side..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good Guy</SelectItem>
                <SelectItem value="bad">Bad Guy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Enter description..."
              required
            />
          </div>

          {/* Evidence Links */}
          <div className="space-y-2">
            <Label>
              Evidence Links (up to 10)
            </Label>
            <p className="text-sm text-muted-foreground">
              Provide links to articles, videos, or other sources that support your claim
            </p>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="url"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://example.com/article"
                    className="flex-1"
                  />
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              ))}
              {links.length < 10 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddLink}
                  className="w-full"
                >
                  <Plus size={18} className="mr-2" />
                  Add another link
                </Button>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && (
              <p className="text-sm text-muted-foreground">
                Selected: {image.name}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Card"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}