
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Users, Utensils, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TeamDashboard from "@/components/TeamDashboard";

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  eatenFoods: string[];
}

interface TeamMember {
  id: string;
  name: string;
  preferences: string[];
  dislikes: string[];
  temporaryPreferences: { food: string; isOneDay: boolean }[];
  temporaryDislikes: { food: string; isOneDay: boolean }[];
}

const Index = () => {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const { toast } = useToast();

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast({
        title: "팀 이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName,
      members: [],
      eatenFoods: [],
    };

    setCurrentTeam(newTeam);
    setTeamName("");
    setShowCreateForm(false);
    
    toast({
      title: "팀이 생성되었습니다! 🎉",
      description: `'${newTeam.name}' 팀에서 맛있는 점심을 찾아보세요!`,
    });
  };

  if (currentTeam) {
    return <TeamDashboard team={currentTeam} setTeam={setCurrentTeam} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Utensils className="w-12 h-12 text-orange-500 mr-3" />
            <h1 className="text-5xl font-bold text-gradient">맛있는 점심</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            팀원들의 취향을 고려한 AI 점심 메뉴 추천 서비스
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-lg">팀 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                팀원들의 선호도와 기피 음식을 쉽게 관리하세요
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <CardTitle className="text-lg">AI 추천</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                모든 팀원이 만족할 수 있는 메뉴를 AI가 추천해드려요
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Utensils className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <CardTitle className="text-lg">히스토리</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                이번 주 먹은 음식을 기록하고 중복을 피해보세요
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Create Team Section */}
        <div className="max-w-md mx-auto">
          {!showCreateForm ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  시작하기
                </CardTitle>
                <CardDescription>
                  새로운 팀을 만들어 점심 메뉴 추천을 받아보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="w-full gradient-food text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg"
                  size="lg"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  팀 생성하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  새 팀 만들기
                </CardTitle>
                <CardDescription>
                  팀 이름을 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="teamName" className="text-sm font-medium text-gray-700">
                    팀 이름
                  </Label>
                  <Input
                    id="teamName"
                    placeholder="예: 우테코 레벨1 10조"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="mt-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTeam()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateTeam}
                    className="flex-1 gradient-food text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200"
                  >
                    생성
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
