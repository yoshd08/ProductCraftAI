
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

interface FrameworkDisplayWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function FrameworkDisplayWrapper({ title, description, children }: FrameworkDisplayWrapperProps) {
  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground min-h-[300px]">
      <CardHeader className="bg-primary/10 pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          {/* Consider adding an icon per framework type later */}
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 flex-grow flex flex-col">
        {children}
      </CardContent>
    </Card>
  );
}
