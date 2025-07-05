
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Plus } from "lucide-react";

interface Props {
  recommendation: string;
  onAddToHistory: () => void;
}

const RecommendationResult = ({ recommendation, onAddToHistory }: Props) => {
  const [isAdding, setIsAdding] = useState(false);

  const menuName = recommendation.split(' - ')[0];
  const description = recommendation.split(' - ')[1] || '';

  const handleAddToHistory = () => {
    setIsAdding(true);
    onAddToHistory();
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="w-6 h-6" />
          AI 추천 메뉴
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-2xl font-bold mb-2">{menuName}</h3>
          {description && (
            <p className="text-white/90 text-sm">{description}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleAddToHistory}
            disabled={isAdding}
            className="flex-1 bg-white text-orange-600 hover:bg-gray-100 font-semibold"
          >
            {isAdding ? (
              "추가 중..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                오늘 메뉴로 등록
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationResult;
