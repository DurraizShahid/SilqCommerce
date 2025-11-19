import React, { useState } from "react";
import { useEnhancedWishlist } from "@/context/EnhancedWishlistContext";
import { H1, P, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { Plus, Share2, Trash2, Edit2, ShoppingCart, Gift, Users, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const EnhancedWishlistPage: React.FC = () => {
  const {
    wishlists,
    activeWishlistId,
    setActiveWishlist,
    createWishlist,
    deleteWishlist,
    renameWishlist,
    removeFromWishlist,
    getWishlistItems,
    shareWishlist,
    clearWishlist,
  } = useEnhancedWishlist();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [editingWishlistId, setEditingWishlistId] = useState<string | null>(null);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [newWishlistType, setNewWishlistType] = useState<"personal" | "shared" | "gift-registry">("personal");

  const activeWishlist = wishlists.find((w) => w.id === activeWishlistId) || wishlists[0];
  const activeItems = activeWishlist ? getWishlistItems(activeWishlist.id) : [];

  const handleCreateWishlist = () => {
    if (!newWishlistName.trim()) {
      toast.error("Please enter a wishlist name");
      return;
    }
    createWishlist(newWishlistName, newWishlistType);
    setNewWishlistName("");
    setNewWishlistType("personal");
    setIsCreateDialogOpen(false);
  };

  const handleRenameWishlist = () => {
    if (!editingWishlistId || !newWishlistName.trim()) return;
    renameWishlist(editingWishlistId, newWishlistName);
    setNewWishlistName("");
    setEditingWishlistId(null);
    setIsRenameDialogOpen(false);
  };

  const handleShare = (wishlistId: string) => {
    shareWishlist(wishlistId);
  };

  const handleAddToCart = (product: typeof activeItems[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getWishlistIcon = (type: string) => {
    switch (type) {
      case "gift-registry":
        return <Gift className="h-4 w-4" />;
      case "shared":
        return <Users className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1 className="mb-2">My Wishlists</H1>
          <P className="text-lg text-muted-foreground">
            Organize your favorite products into multiple wishlists
          </P>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Wishlist
        </Button>
      </div>

      <Tabs value={activeWishlistId || undefined} onValueChange={setActiveWishlist}>
        <TabsList className="grid w-full grid-cols-auto gap-2 overflow-x-auto">
          {wishlists.map((wishlist) => (
            <TabsTrigger key={wishlist.id} value={wishlist.id} className="flex items-center gap-2">
              {getWishlistIcon(wishlist.type)}
              <span>{wishlist.name}</span>
              <Badge variant="secondary" className="ml-1">
                {wishlist.items.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {wishlists.map((wishlist) => (
          <TabsContent key={wishlist.id} value={wishlist.id} className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div>
                  <H1 className="text-2xl">{wishlist.name}</H1>
                  <Muted>
                    {wishlist.items.length} item{wishlist.items.length !== 1 ? "s" : ""}
                    {wishlist.type !== "personal" && (
                      <Badge variant="outline" className="ml-2">
                        {wishlist.type === "gift-registry" ? "Gift Registry" : "Shared"}
                      </Badge>
                    )}
                  </Muted>
                </div>
              </div>
              <div className="flex gap-2">
                {wishlist.type === "shared" || wishlist.type === "gift-registry" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleShare(wishlist.id)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingWishlistId(wishlist.id);
                    setNewWishlistName(wishlist.name);
                    setIsRenameDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {!wishlist.isDefault && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteWishlist(wishlist.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {wishlist.items.length > 0 && (
                  <Button variant="ghost" onClick={() => clearWishlist(wishlist.id)}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {wishlist.items.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <P className="text-muted-foreground mb-4">This wishlist is empty.</P>
                  <Link to="/products">
                    <Button>Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.items.map((item) => (
                  <Card key={item.id} className="flex flex-col">
                    <CardHeader className="p-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-64 w-full object-cover"
                      />
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2 pt-4">
                      <CardTitle>{item.name}</CardTitle>
                      <P className="text-accent-gold font-semibold">{formatPrice(item.price)}</P>
                      <Muted>Added {new Date(item.addedAt).toLocaleDateString()}</Muted>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link to={`/products/${item.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWishlist(item.id, wishlist.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Wishlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>Organize your favorite products into lists</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wishlistName">Wishlist Name</Label>
              <Input
                id="wishlistName"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                placeholder="e.g., Birthday Wishlist"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wishlistType">Type</Label>
              <Select
                value={newWishlistType}
                onValueChange={(value) =>
                  setNewWishlistType(value as "personal" | "shared" | "gift-registry")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="gift-registry">Gift Registry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWishlist}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Wishlist Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Wishlist</DialogTitle>
            <DialogDescription>Change the name of your wishlist</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="renameWishlistName">Wishlist Name</Label>
              <Input
                id="renameWishlistName"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                placeholder="Enter new name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameWishlist}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedWishlistPage;

