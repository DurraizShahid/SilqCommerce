import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Share2, Copy, Image as ImageIcon, Grid3x3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/dummyData';

interface StyleBoard {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  productIds: string[];
  isPublic: boolean;
  shareLink: string;
  createdAt: string;
}

const StyleBoardsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<StyleBoard | null>(null);
  const [boardForm, setBoardForm] = useState({
    name: '',
    description: '',
  });

  const [boards, setBoards] = useState<StyleBoard[]>([
    {
      id: 'sb1',
      name: 'Winter Essentials',
      description: 'My favorite winter pieces',
      productIds: ['prod1', 'prod2', 'prod3'],
      isPublic: true,
      shareLink: 'https://luxurystore.com/board/abc123',
      createdAt: '2023-11-15',
    },
    {
      id: 'sb2',
      name: 'Formal Attire',
      description: 'Elegant pieces for special occasions',
      productIds: ['prod4', 'prod5'],
      isPublic: false,
      shareLink: 'https://luxurystore.com/board/xyz789',
      createdAt: '2023-11-10',
    },
  ]);

  const handleCreate = () => {
    setEditingBoard(null);
    setBoardForm({
      name: '',
      description: '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleSave = () => {
    if (!boardForm.name) {
      toast.error('Please enter a board name');
      return;
    }

    if (editingBoard) {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === editingBoard.id
            ? { ...b, ...boardForm, updatedAt: new Date().toISOString() }
            : b
        )
      );
      toast.success('Style board updated');
      setIsEditDialogOpen(false);
    } else {
      const newBoard: StyleBoard = {
        id: `sb-${Date.now()}`,
        ...boardForm,
        productIds: [],
        isPublic: false,
        shareLink: `https://luxurystore.com/board/${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setBoards([...boards, newBoard]);
      toast.success('Style board created!');
      setIsCreateDialogOpen(false);
    }
  };

  const handleShare = (board: StyleBoard) => {
    navigator.clipboard.writeText(board.shareLink);
    toast.success('Share link copied to clipboard!');
  };

  const boardProducts = (productIds: string[]) => {
    return products.filter((p) => productIds.includes(p.id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Style Boards</H1>
          <P className="text-muted-foreground">
            Create and share curated collections of your favorite products
          </P>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Grid3x3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-2">No style boards yet</P>
            <P className="text-sm text-muted-foreground mb-4">
              Create your first style board to curate and share product collections
            </P>
            <Button onClick={handleCreate}>Create Your First Board</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => {
            const boardItems = boardProducts(board.productIds);
            return (
              <Card key={board.id} className="overflow-hidden">
                {board.coverImage ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={board.coverImage}
                      alt={board.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : boardItems.length > 0 ? (
                  <div className="h-48 grid grid-cols-2 gap-1 p-1 bg-muted">
                    {boardItems.slice(0, 4).map((product) => (
                      <img
                        key={product.id}
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{board.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {board.description}
                      </CardDescription>
                    </div>
                    {board.isPublic && (
                      <Badge variant="outline" className="ml-2">Public</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <Muted>{board.productIds.length} items</Muted>
                    <Muted>
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </Muted>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleShare(board)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingBoard(board);
                        setBoardForm({
                          name: board.name,
                          description: board.description,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBoards((prev) => prev.filter((b) => b.id !== board.id));
                        toast.success('Style board deleted');
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {boardItems.length > 0 && (
                    <Link to={`/style-boards/${board.id}`}>
                      <Button variant="link" className="w-full p-0">
                        View Board →
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Style Board</DialogTitle>
            <DialogDescription>
              Create a new style board to curate products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="boardName">Board Name *</Label>
              <Input
                id="boardName"
                value={boardForm.name}
                onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
                placeholder="e.g., Winter Essentials"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boardDescription">Description</Label>
              <Textarea
                id="boardDescription"
                value={boardForm.description}
                onChange={(e) => setBoardForm({ ...boardForm, description: e.target.value })}
                rows={3}
                placeholder="Describe your style board..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Create Board</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Style Board</DialogTitle>
            <DialogDescription>
              Update your style board details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editBoardName">Board Name *</Label>
              <Input
                id="editBoardName"
                value={boardForm.name}
                onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBoardDescription">Description</Label>
              <Textarea
                id="editBoardDescription"
                value={boardForm.description}
                onChange={(e) => setBoardForm({ ...boardForm, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Update Board</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StyleBoardsPage;

