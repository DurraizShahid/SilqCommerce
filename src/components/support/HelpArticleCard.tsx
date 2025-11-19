import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { P, Muted } from '@/components/ui/typography';
import { Eye, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HelpArticleCardProps {
  article: {
    id: string;
    title: string;
    content: string;
    category: string;
    views: number;
    lastUpdated?: string;
    readTime?: number;
  };
  onClick?: () => void;
}

const HelpArticleCard: React.FC<HelpArticleCardProps> = ({ article, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? '' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
            <Badge variant="outline">{article.category}</Badge>
          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <P className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.content}</P>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{article.views.toLocaleString()} views</span>
          </div>
          {article.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime} min read</span>
            </div>
          )}
          {article.lastUpdated && (
            <Muted className="text-xs">
              Updated {new Date(article.lastUpdated).toLocaleDateString()}
            </Muted>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpArticleCard;

