
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Heart, X, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  preferences: string[];
  dislikes: string[];
  temporaryPreferences: { food: string; isOneDay: boolean }[];
  temporaryDislikes: { food: string; isOneDay: boolean }[];
}

interface Props {
  member: TeamMember;
  onUpdate: (member: TeamMember) => void;
}

const TeamMemberCard = ({ member, onUpdate }: Props) => {
  const [showAddPreference, setShowAddPreference] = useState(false);
  const [showAddDislike, setShowAddDislike] = useState(false);
  const [newPreference, setNewPreference] = useState("");
  const [newDislike, setNewDislike] = useState("");
  const [isOneDayPref, setIsOneDayPref] = useState(false);
  const [isOneDayDislike, setIsOneDayDislike] = useState(false);
  const { toast } = useToast();

  const addPreference = () => {
    if (!newPreference.trim()) return;

    const updatedMember = {
      ...member,
      preferences: isOneDayPref ? member.preferences : [...member.preferences, newPreference],
      temporaryPreferences: isOneDayPref 
        ? [...member.temporaryPreferences, { food: newPreference, isOneDay: true }]
        : member.temporaryPreferences,
    };

    onUpdate(updatedMember);
    setNewPreference("");
    setIsOneDayPref(false);
    setShowAddPreference(false);
    
    toast({
      title: "선호 음식이 추가되었습니다! ❤️",
      description: isOneDayPref ? "(하루만 적용)" : "",
    });
  };

  const addDislike = () => {
    if (!newDislike.trim()) return;

    const updatedMember = {
      ...member,
      dislikes: isOneDayDislike ? member.dislikes : [...member.dislikes, newDislike],
      temporaryDislikes: isOneDayDislike 
        ? [...member.temporaryDislikes, { food: newDislike, isOneDay: true }]
        : member.temporaryDislikes,
    };

    onUpdate(updatedMember);
    setNewDislike("");
    setIsOneDayDislike(false);
    setShowAddDislike(false);
    
    toast({
      title: "기피 음식이 추가되었습니다! 🚫",
      description: isOneDayDislike ? "(하루만 적용)" : "",
    });
  };

  const removePreference = (index: number) => {
    const updatedMember = {
      ...member,
      preferences: member.preferences.filter((_, i) => i !== index),
    };
    onUpdate(updatedMember);
  };

  const removeDislike = (index: number) => {
    const updatedMember = {
      ...member,
      dislikes: member.dislikes.filter((_, i) => i !== index),
    };
    onUpdate(updatedMember);
  };

  const removeTempPreference = (index: number) => {
    const updatedMember = {
      ...member,
      temporaryPreferences: member.temporaryPreferences.filter((_, i) => i !== index),
    };
    onUpdate(updatedMember);
  };

  const removeTempDislike = (index: number) => {
    const updatedMember = {
      ...member,
      temporaryDislikes: member.temporaryDislikes.filter((_, i) => i !== index),
    };
    onUpdate(updatedMember);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          {member.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preferences */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <Label className="font-semibold">선호 음식</Label>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {member.preferences.map((pref, index) => (
              <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                {pref}
                <button
                  onClick={() => removePreference(index)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {member.temporaryPreferences.map((pref, index) => (
              <Badge key={`temp-${index}`} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                <Calendar className="w-3 h-3 mr-1" />
                {pref.food}
                <button
                  onClick={() => removeTempPreference(index)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          {!showAddPreference ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddPreference(true)}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              선호 음식 추가
            </Button>
          ) : (
            <div className="space-y-3 p-3 bg-green-50 rounded-lg">
              <Input
                placeholder="예: 시원한 음식"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPreference()}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`oneday-pref-${member.id}`}
                  checked={isOneDayPref}
                  onCheckedChange={(checked) => setIsOneDayPref(checked as boolean)}
                />
                <Label htmlFor={`oneday-pref-${member.id}`} className="text-sm">
                  하루만 적용
                </Label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addPreference}>추가</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddPreference(false)}>
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Dislikes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-500" />
            <Label className="font-semibold">기피 음식</Label>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {member.dislikes.map((dislike, index) => (
              <Badge key={index} className="bg-red-100 text-red-800 hover:bg-red-200">
                {dislike}
                <button
                  onClick={() => removeDislike(index)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {member.temporaryDislikes.map((dislike, index) => (
              <Badge key={`temp-${index}`} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                <Calendar className="w-3 h-3 mr-1" />
                {dislike.food}
                <button
                  onClick={() => removeTempDislike(index)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          {!showAddDislike ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddDislike(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              기피 음식 추가
            </Button>
          ) : (
            <div className="space-y-3 p-3 bg-red-50 rounded-lg">
              <Input
                placeholder="예: 칼로리가 높은 음식"
                value={newDislike}
                onChange={(e) => setNewDislike(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDislike()}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`oneday-dislike-${member.id}`}
                  checked={isOneDayDislike}
                  onCheckedChange={(checked) => setIsOneDayDislike(checked as boolean)}
                />
                <Label htmlFor={`oneday-dislike-${member.id}`} className="text-sm">
                  하루만 적용
                </Label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addDislike}>추가</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddDislike(false)}>
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
