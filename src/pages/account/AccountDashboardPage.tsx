import React from "react";
import { H1, H2, P, Muted } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { orders } from "@/data/dummyData";
import { Package, Repeat, Calendar, MessageSquare, RotateCcw, CreditCard, Settings, Star, Bell, Users, Sparkles, TrendingUp, Trophy, Gift, Grid3x3, Shield, Shirt, Palette, User, Calendar as CalendarIcon } from 'lucide-react';

const AccountDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const userOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H1 className="mb-2 text-4xl">Welcome back, {user.name.split(" ")[0]}</H1>
          <P className="text-lg text-muted-foreground">
            Manage your profile, track orders, and access exclusive services.
          </P>
        </div>
        <div className="flex gap-3">
          {user.role === "vendor" ? (
            <Link to="/admin/products">
              <Button variant="outline">Manage Listings</Button>
            </Link>
          ) : (
            <Link to="/vendor/apply">
              <Button variant="outline">Become a Vendor</Button>
            </Link>
          )}
          <Button variant="ghost" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Type</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-2xl font-semibold capitalize">{user.role}</P>
            <Muted>Upgrade to VIP by completing your profile.</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-2xl font-semibold">{userOrders.length}</P>
            <Muted>Recent purchases synced across devices.</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-2xl font-semibold">2</P>
            <Muted>Ready for one-click checkout.</Muted>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <H2>Quick Links</H2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/account/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Orders
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/subscriptions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Subscriptions
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/pre-orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Pre-Orders
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/support">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Support
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/returns">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Returns
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/payment-methods">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/preferences">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/security">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/loyalty">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/notifications">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/following">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Following
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/style-quiz">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Style Quiz
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/reviews">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  My Reviews
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/referrals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referrals
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/insights">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Insights
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/achievements">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/gift-registry">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Gift Registry
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/account/style-boards">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3x3 className="h-5 w-5" />
                  Style Boards
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/personalized">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Personalized Home
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <H2>Styling & Personalization</H2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/styling/outfit-builder">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="h-5 w-5" />
                  Outfit Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Create complete outfits</Muted>
              </CardContent>
            </Card>
          </Link>
          <Link to="/styling/wardrobe-planner">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3x3 className="h-5 w-5" />
                  Wardrobe Planner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Plan and organize your wardrobe</Muted>
              </CardContent>
            </Card>
          </Link>
          <Link to="/styling/color-analysis">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Find your perfect color palette</Muted>
              </CardContent>
            </Card>
          </Link>
          <Link to="/styling/body-type">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Body Type Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Get personalized styling tips</Muted>
              </CardContent>
            </Card>
          </Link>
          <Link to="/styling/consultation">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Style Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Book with a professional stylist</Muted>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <H2>Recent Orders</H2>
        <div className="grid gap-4 md:grid-cols-2">
          {userOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order {order.id}</CardTitle>
                <span className="rounded-full bg-muted px-3 py-1 text-sm capitalize">{order.status}</span>
              </CardHeader>
              <CardContent className="space-y-3">
                <Muted>Placed on {new Date(order.orderDate).toLocaleDateString()}</Muted>
                <P className="font-semibold">${order.total.toFixed(2)}</P>
                <div className="text-sm text-muted-foreground">
                  {order.items.map((item) => item.productName).join(", ")}
                </div>
                <Link to={`/account/orders/${order.id}/track`}>
                  <Button variant="outline" size="sm">
                    View details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboardPage;

