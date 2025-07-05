
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Sparkles, RefreshCw, Users, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TeamMemberCard from "./TeamMemberCard";
import RecommendationResult from "./RecommendationResult";

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

interface Props {
  team: Team;
  setTeam: (team: Team | null) => void;
}

const TeamDashboard = ({ team, setTeam }: Props) => {
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newFood, setNewFood] = useState("");
  const { toast } = useToast();

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      toast({
        title: "팀원 이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName,
      preferences: [],
      dislikes: [],
      temporaryPreferences: [],
      temporaryDislikes: [],
    };

    setTeam({
      ...team,
      members: [...team.members, newMember],
    });

    setNewMemberName("");
    setShowAddMember(false);
    
    toast({
      title: "팀원이 추가되었습니다! 👥",
      description: `${newMember.name}님이 팀에 합류했습니다.`,
    });
  };

  const updateMember = (updatedMember: TeamMember) => {
    setTeam({
      ...team,
      members: team.members.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      ),
    });
  };

  const getRecommendation = async () => {
    setIsLoading(true);
    
    // AI 추천 로직 시뮬레이션
    const possibleRecommendations = [
      "콩국수 - 시원하고 칼로리가 낮으며, 회나 치킨이 들어가지 않은 건강한 메뉴입니다",
      "냉우동 - 시원한 국물과 쫄깃한 면발이 더운 날씨에 완벽한 선택입니다",
      "포케볼 - 신선한 채소와 단백질이 균형잡힌 건강한 하와이안 메뉴입니다",
      "냉면 - 시원한 육수와 면발로 여름철에 인기가 높은 한국 전통 메뉴입니다",
      "샐러드 파스타 - 가벼우면서도 포만감을 주는 이탈리안 메뉴입니다"
    ];

    // 2초 후 추천 결과 반환
    setTimeout(() => {
      const randomRecommendation = possibleRecommendations[
        Math.floor(Math.random() * possibleRecommendations.length)
      ];
      setRecommendation(randomRecommendation);
      setIsLoading(false);
      
      toast({
        title: "메뉴 추천 완료! 🍽️",
        description: "AI가 팀원들의 취향을 고려하여 메뉴를 추천했습니다.",
      });
    }, 2000);
  };

  const addEatenFood = () => {
    if (!newFood.trim()) {
      toast({
        title: "음식 이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setTeam({
      ...team,
      eatenFoods: [...team.eatenFoods, newFood],
    });

    setNewFood("");
    
    toast({
      title: "오늘의 메뉴가 등록되었습니다! 📝",
      description: `${newFood}가(이) 이번 주 메뉴에 추가되었습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost" 
              onClick={() => setTeam(null)}
              className="mr-4 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{team.name}</h1>
              <p className="text-gray-600">팀원 {team.members.length}명</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              팀원 관리
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              메뉴 추천
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              이번 주 메뉴
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Add Member */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-500" />
                  팀원 추가
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showAddMember ? (
                  <Button 
                    onClick={() => setShowAddMember(true)}
                    variant="outline"
                    className="w-full"
                  >
                    + 새 팀원 추가
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Label htmlFor="memberName">팀원 이름</Label>
                    <Input
                      id="memberName"
                      placeholder="예: 수이"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddMember} className="flex-1">
                        추가
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddMember(false)}
                        className="flex-1"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Members List */}
            <div className="grid gap-4">
              {team.members.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">아직 팀원이 없습니다.</p>
                    <p className="text-gray-400 text-sm">첫 번째 팀원을 추가해보세요!</p>
                  </CardContent>
                </Card>
              ) : (
                team.members.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onUpdate={updateMember}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommendation" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  AI 메뉴 추천
                </CardTitle>
                <CardDescription>
                  팀원들의 선호도와 기피 음식을 고려한 맞춤 추천
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={getRecommendation}
                  disabled={isLoading || team.members.length === 0}
                  className="w-full gradient-food text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-200"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      추천 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {recommendation ? '다시 추천' : '추천 받기'}
                    </>
                  )}
                </Button>

                {team.members.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">
                    팀원을 먼저 추가해주세요
                  </p>
                )}
              </CardContent>
            </Card>

            {recommendation && (
              <RecommendationResult 
                recommendation={recommendation}
                onAddToHistory={addEatenFood}
              />
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  이번 주 우리 팀이 먹은 음식
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.eatenFoods.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">정보 x</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {team.eatenFoods.map((food, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {food}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4">
                  <Label htmlFor="newFood" className="text-sm font-medium">
                    오늘 우리팀이 먹은 음식 추가
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="newFood"
                      placeholder="예: 냉우동"
                      value={newFood}
                      onChange={(e) => setNewFood(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addEatenFood()}
                    />
                    <Button onClick={addEatenFood}>추가</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamDashboard;
