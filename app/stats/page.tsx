"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Cell } from "recharts";
import { Users, Building2, ThumbsUp, ThumbsDown, AlertCircle, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatsData {
  overview: {
    totalCards: number;
    totalVotes: number;
    totalDisputes: number;
    totalLikes: number;
    totalDislikes: number;
  };
  cardsByType: Array<{ type: string; count: number }>;
  cardsBySide: Array<{ side: string; count: number }>;
  cardsOverTime: Array<{ date: string; count: number }>;
  organizations: {
    total: number;
    bySide: Array<{ side: string; count: number }>;
    topIndustries: Array<{ industry: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    mostLiked: Array<{ id: number; name: string; likes: number; industry: string }>;
    mostDisliked: Array<{ id: number; name: string; dislikes: number; industry: string }>;
  };
  people: {
    total: number;
    bySide: Array<{ side: string; count: number }>;
    topFields: Array<{ field: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    mostLiked: Array<{ id: number; name: string; likes: number; field: string }>;
    mostDisliked: Array<{ id: number; name: string; dislikes: number; field: string }>;
  };
}

const COLORS = {
  primary: "#22c55e",
  secondary: "#ef4444",
  accent: "#3b82f6",
  warning: "#f59e0b",
  muted: "#6b7280",
};

const PIE_COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen p-4 sm:p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load statistics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Platform Statistics</h1>
          <p className="text-lg text-muted-foreground">
            Insights and analytics from The Great Wall
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalCards}</div>
              <p className="text-xs text-muted-foreground">People & Organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalVotes}</div>
              <p className="text-xs text-muted-foreground">Community engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalLikes}</div>
              <p className="text-xs text-muted-foreground">Positive reactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dislikes</CardTitle>
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalDislikes}</div>
              <p className="text-xs text-muted-foreground">Negative reactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disputes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalDisputes}</div>
              <p className="text-xs text-muted-foreground">Open challenges</p>
            </CardContent>
          </Card>
        </div>

        {/* General Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cards by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Cards by Type</CardTitle>
              <CardDescription>Distribution of people vs organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ type: { label: "Type" } }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.cardsByType.map(item => ({
                        name: item.type === "person" ? "People" : "Organizations",
                        value: item.count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill={COLORS.primary}
                      dataKey="value"
                    >
                      {stats.cardsByType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Cards by Side */}
          <Card>
            <CardHeader>
              <CardTitle>Cards by Side</CardTitle>
              <CardDescription>Good vs Bad distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ side: { label: "Side" } }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.cardsBySide.map(item => ({
                    side: item.side === "good" ? "Good Guys" : "Bad Guys",
                    count: item.count,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="side" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill={COLORS.accent} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Cards Over Time */}
        {stats.cardsOverTime.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cards Created Over Time</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ date: { label: "Date" } }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.cardsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} name="Cards" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Organizations and People */}
        <Tabs defaultValue="organizations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Building2 size={16} />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users size={16} />
              People
            </TabsTrigger>
          </TabsList>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6 mt-6">
            {/* Organization Stats Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Organization Statistics</h2>
              <p className="text-muted-foreground">Total Organizations: {stats.organizations.total}</p>
            </div>

            {/* Organizations Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orgs by Side */}
              <Card>
                <CardHeader>
                  <CardTitle>Organizations by Side</CardTitle>
                  <CardDescription>Good vs Bad distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ side: { label: "Side" } }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.organizations.bySide.map(item => ({
                            name: item.side === "good" ? "Good Guys" : "Bad Guys",
                            value: item.count,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill={COLORS.primary}
                          dataKey="value"
                        >
                          {stats.organizations.bySide.map((item, index) => (
                            <Cell key={`cell-${index}`} fill={item.side === "good" ? COLORS.primary : COLORS.secondary} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Top Industries */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Industries</CardTitle>
                  <CardDescription>Most represented industries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ industry: { label: "Industry" } }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.organizations.topIndustries} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="industry" type="category" width={150} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill={COLORS.accent} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Organization Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Countries (Organizations)</CardTitle>
                <CardDescription>Most represented countries</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ country: { label: "Country" } }} className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.organizations.topCountries} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="country" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill={COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Organizations Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Liked Organizations */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Liked Organizations</CardTitle>
                  <CardDescription>Top 5 by likes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.organizations.mostLiked.map((org, index) => (
                      <div key={org.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{org.name}</p>
                            <p className="text-sm text-muted-foreground">{org.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <ThumbsUp size={16} />
                          <span className="font-bold">{org.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Most Disliked Organizations */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Disliked Organizations</CardTitle>
                  <CardDescription>Top 5 by dislikes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.organizations.mostDisliked.map((org, index) => (
                      <div key={org.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{org.name}</p>
                            <p className="text-sm text-muted-foreground">{org.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-red-600">
                          <ThumbsDown size={16} />
                          <span className="font-bold">{org.dislikes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* People Tab */}
          <TabsContent value="people" className="space-y-6 mt-6">
            {/* People Stats Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">People Statistics</h2>
              <p className="text-muted-foreground">Total People: {stats.people.total}</p>
            </div>

            {/* People Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* People by Side */}
              <Card>
                <CardHeader>
                  <CardTitle>People by Side</CardTitle>
                  <CardDescription>Good vs Bad distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ side: { label: "Side" } }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.people.bySide.map(item => ({
                            name: item.side === "good" ? "Good Guys" : "Bad Guys",
                            value: item.count,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill={COLORS.primary}
                          dataKey="value"
                        >
                          {stats.people.bySide.map((item, index) => (
                            <Cell key={`cell-${index}`} fill={item.side === "good" ? COLORS.primary : COLORS.secondary} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Top Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Fields</CardTitle>
                  <CardDescription>Most represented fields</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ field: { label: "Field" } }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.people.topFields} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="field" type="category" width={150} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill={COLORS.accent} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* People Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Countries (People)</CardTitle>
                <CardDescription>Most represented countries</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ country: { label: "Country" } }} className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.people.topCountries} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="country" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill={COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top People Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Liked People */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Liked People</CardTitle>
                  <CardDescription>Top 5 by likes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.people.mostLiked.map((person, index) => (
                      <div key={person.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-muted-foreground">{person.field}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <ThumbsUp size={16} />
                          <span className="font-bold">{person.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Most Disliked People */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Disliked People</CardTitle>
                  <CardDescription>Top 5 by dislikes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.people.mostDisliked.map((person, index) => (
                      <div key={person.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-muted-foreground">{person.field}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-red-600">
                          <ThumbsDown size={16} />
                          <span className="font-bold">{person.dislikes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
