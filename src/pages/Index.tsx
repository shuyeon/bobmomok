import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Utensils, Sparkles, LogOut, User as UserIcon, Heart, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, Team } from "@/contexts/UserContext";
import TeamDashboard from "@/components/TeamDashboard";

const Index = () => {
  const { user, teams, addTeam, setUser, updateUser } = useUser();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [showUserPreferences, setShowUserPreferences] = useState(false);
  const [newPreference, setNewPreference] = useState("");
  const [newDislike, setNewDislike] = useState("");
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
      createdBy: user!.id,
    };

    addTeam(newTeam);
    setCurrentTeam(newTeam);
    setTeamName("");
    setShowCreateForm(false);
    
    toast({
      title: "팀이 생성되었습니다! 🎉",
      description: `'${newTeam.name}' 팀에서 맛있는 점심을 찾아보세요!`,
    });
  };

  const handleSelectTeam = (team: Team) => {
    setCurrentTeam(team);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentTeam(null);
    toast({
      title: "로그아웃되었습니다",
      description: "다시 로그인해주세요",
    });
  };

  const addUserPreference = () => {
    if (!newPreference.trim() || !user) return;

    const updatedUser = {
      ...user,
      preferences: [...user.preferences, newPreference]
    };

    updateUser(updatedUser);
    setNewPreference("");
    
    toast({
      title: "선호 음식이 추가되었습니다! ❤️",
    });
  };

  const addUserDislike = () => {
    if (!newDislike.trim() || !user) return;

    const updatedUser = {
      ...user,
      dislikes: [...user.dislikes, newDislike]
    };

    updateUser(updatedUser);
    setNewDislike("");
    
    toast({
      title: "기피 음식이 추가되었습니다! 🚫",
    });
  };

  const removeUserPreference = (index: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: user.preferences.filter((_, i) => i !== index)
    };
    updateUser(updatedUser);
  };

  const removeUserDislike = (index: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      dislikes: user.dislikes.filter((_, i) => i !== index)
    };
    updateUser(updatedUser);
  };

  // 로그인하지 않은 상태
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Utensils className="w-8 h-8 text-orange-500 mr-2" />
              <h1 className="text-2xl font-bold text-gradient">맛있는 점심</h1>
            </div>
            <CardTitle>로그인</CardTitle>
            <CardDescription>점심 메뉴 추천 서비스에 오신 것을 환영합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setUser({ id: 'demo-user', name: '김머핀', preferences: [], dislikes: [] })}
              className="w-full gradient-food text-white font-semibold py-3 rounded-xl"
              size="lg"
            >
              김머핀으로 로그인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentTeam) {
    return <TeamDashboard team={currentTeam} setTeam={setCurrentTeam} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center mb-4">
              <Utensils className="w-12 h-12 text-orange-500 mr-3" />
              <h1 className="text-5xl font-bold text-gradient">맛있는 점심</h1>
            </div>
            <p className="text-xl text-gray-600">
              {user.name}님 환영합니다! 팀원들의 취향을 고려한 AI 점심 메뉴 추천 서비스
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="ml-4"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>

        {/* User Preferences */}
        <div className="mb-12">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-500" />
                나의 선호/기피 음식
              </CardTitle>
              <CardDescription>
                여기서 설정한 선호도는 새로 생성하는 팀에 자동으로 반영됩니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preferences */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <Label className="font-semibold">선호 음식</Label>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {user.preferences.map((pref, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                      {pref}
                      <button
                        onClick={() => removeUserPreference(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="예: 시원한 음식"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addUserPreference()}
                  />
                  <Button onClick={addUserPreference}>추가</Button>
                </div>
              </div>

              {/* Dislikes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <Label className="font-semibold">기피 음식</Label>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {user.dislikes.map((dislike, index) => (
                    <Badge key={index} className="bg-red-100 text-red-800 hover:bg-red-200">
                      {dislike}
                      <button
                        onClick={() => removeUserDislike(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="예: 칼로리가 높은 음식"
                    value={newDislike}
                    onChange={(e) => setNewDislike(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addUserDislike()}
                  />
                  <Button onClick={addUserDislike}>추가</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Existing Teams */}
        {teams.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">내 팀 목록</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card 
                  key={team.id} 
                  className="border-0 shadow-lg bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleSelectTeam(team)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      {team.name}
                    </CardTitle>
                    <CardDescription>
                      팀원 {team.members.length}명 • 이번 주 {team.eatenFoods.length}개 메뉴
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full gradient-food text-white font-semibold">
                      팀 입장하기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
                  새 팀 만들기
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
