import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SkeletonCard = () => (
  <Card className="border-2 border-border animate-pulse">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="h-4 w-24 bg-muted rounded" />
      <div className="h-12 w-12 bg-muted rounded-xl" />
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="h-8 w-16 bg-muted rounded" />
      <div className="h-3 w-32 bg-muted rounded" />
    </CardContent>
  </Card>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl border border-border animate-pulse">
    <div className="h-12 w-12 bg-muted rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-32 bg-muted rounded" />
      <div className="h-3 w-48 bg-muted rounded" />
    </div>
    <div className="h-6 w-20 bg-muted rounded-full" />
  </div>
);

export const SkeletonDashboard = () => (
  <div className="p-4 md:p-8 space-y-8">
    {/* Header */}
    <div className="space-y-2 animate-pulse">
      <div className="h-10 w-64 bg-muted rounded" />
      <div className="h-5 w-48 bg-muted rounded" />
    </div>

    {/* Stats Grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>

    {/* Charts */}
    <div className="grid gap-4 lg:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="border-2 border-border animate-pulse">
          <CardHeader>
            <div className="h-5 w-32 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Appointments */}
    <div className="space-y-4">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <Card className="border-2 border-border">
        <CardContent className="p-6 space-y-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);