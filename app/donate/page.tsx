"use client";

import { Heart, HandHeart, Server, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Donate() {

  const palestineOrganizations = [
    {
      name: "United Nations Relief and Works Agency (UNRWA)",
      url: "https://donate.unrwa.org",
      description: "UN agency providing essential services to Palestinian refugees"
    },
    {
      name: "Palestine Children's Relief Fund (PCRF)",
      url: "https://www.pcrf.net/donate",
      description: "Medical care and humanitarian aid for Palestinian children"
    },
    {
      name: "Medical Aid for Palestinians (MAP)",
      url: "https://www.map.org.uk/donate",
      description: "Healthcare and medical aid to Palestinians in need"
    },
    {
      name: "Islamic Relief Worldwide",
      url: "https://islamic-relief.org/appeals/palestine-emergency-appeal/",
      description: "Emergency humanitarian relief and development programs"
    },
    {
      name: "Doctors Without Borders (MSF)",
      url: "https://www.doctorswithoutborders.org/what-we-do/where-we-work/palestine",
      description: "Emergency medical humanitarian assistance"
    }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Heart className="text-destructive" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Support the Cause
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose to donate directly to verified Palestinian humanitarian organizations or support this platform
          </p>
        </div>

        {/* Tabs for Donation Types */}
        <Tabs defaultValue="palestine" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto h-auto p-1">
            <TabsTrigger value="palestine" className="flex items-center gap-2 px-4 py-3 text-sm">
              <HandHeart size={18} className="flex-shrink-0" />
              <span className="whitespace-normal text-center leading-tight">Direct Support to Palestine</span>
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center gap-2 px-4 py-3 text-sm">
              <Server size={18} className="flex-shrink-0" />
              <span className="whitespace-normal text-center leading-tight">Support Platform</span>
            </TabsTrigger>
          </TabsList>

          {/* Palestine Organizations Tab */}
          <TabsContent value="palestine" className="mt-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Verified Palestinian Relief Organizations</h2>
              <p className="text-muted-foreground">
                Donate 100% directly to trusted humanitarian organizations providing aid in Gaza
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {palestineOrganizations.map((org) => (
                <Card key={org.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription>{org.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <a href={org.url} target="_blank" rel="noopener noreferrer">
                        Donate to {org.name.split(' ')[0]}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Why Donate Directly?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">100% to Humanitarian Aid</h3>
                  <p className="text-sm text-muted-foreground">
                    Your entire donation goes directly to the organization, with no platform fees
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Verified Organizations</h3>
                  <p className="text-sm text-muted-foreground">
                    All listed organizations have established track records of providing humanitarian aid in Gaza
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Immediate Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Funds go directly to emergency relief, medical care, food, water, and shelter
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">$25</h3>
                  <p className="text-xs text-muted-foreground">Emergency food packages for a family</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">$50</h3>
                  <p className="text-xs text-muted-foreground">Clean water and hygiene kits</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">$100</h3>
                  <p className="text-xs text-muted-foreground">Medical supplies and emergency care</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">$250+</h3>
                  <p className="text-xs text-muted-foreground">Shelter, food, and medical aid for multiple families</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Support Tab */}
          <TabsContent value="platform" className="mt-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Support the Platform</h2>
              <p className="text-muted-foreground">
                Help us maintain this accountability platform
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Donation Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Support via Buy Me a Coffee</CardTitle>
                    <CardDescription>
                      One-time donation or monthly support
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
                    <p className="text-sm text-muted-foreground text-center">
                      Support the platform through Buy Me a Coffee. You can make a one-time contribution or set up monthly support.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                      <p className="text-sm font-medium text-foreground">Click the button or scan the QR code:</p>

                      <Button
                        asChild
                        size="lg"
                        className="bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-bold border-2 border-black text-lg px-8 py-6 h-auto"
                        style={{ fontFamily: 'Cookie, cursive' }}
                      >
                        <a
                          href="https://buymeacoffee.com/thecalmprig"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3"
                        >
                          <Coffee size={28} />
                          Buy me a coffee
                        </a>
                      </Button>

                      <div className="mt-4">
                        <img
                          src="/qr-code.png"
                          alt="Buy Me a Coffee QR Code"
                          className="w-48 h-48 border-2 border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      All excess funds beyond running costs will be donated to Palestinian relief organizations
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Info Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How Funds Are Used</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">Platform Operating Costs</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Server hosting and infrastructure</li>
                          <li>• Security and data protection</li>
                          <li>• Content moderation</li>
                          <li>• Transparent financial reporting</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">Excess Donations</p>
                        <p className="text-xs text-muted-foreground">
                          Any funds collected beyond operational costs are donated to verified Palestinian humanitarian organizations
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Support?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Your support helps maintain this accountability platform, ensuring public figures and corporations can be held accountable for their positions on humanitarian issues.
                    </p>
                    <p>
                      Monthly supporters help us plan for sustainable long-term operations while keeping the platform accessible to all.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Transparency Section */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Transparency</CardTitle>
                <CardDescription>
                  Every dollar is accounted for with full transparency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Our Commitment</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We maintain this platform as a tool for awareness and accountability. All donations are used to cover operational costs, with any excess funds donated to verified Palestinian humanitarian organizations.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We publish quarterly financial reports detailing all platform donations received, operational expenses, and excess funds distributed to humanitarian organizations, along with receipts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Ways to Help */}
            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Support</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Spread Awareness</h3>
                  <p className="text-sm text-muted-foreground">
                    Share the platform and help others make informed decisions
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Document and Verify</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit documented evidence and help verify submissions
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Contact Representatives</h3>
                  <p className="text-sm text-muted-foreground">
                    Advocate for policy changes and international humanitarian law
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Donate Directly</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the other tab to donate 100% directly to organizations
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
