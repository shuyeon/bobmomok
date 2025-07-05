
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  preferences: string[];
  dislikes: string[];
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  eatenFoods: string[];
  createdBy: string;
}

interface TeamMember {
  id: string;
  name: string;
  preferences: string[];
  dislikes: string[];
  temporaryPreferences: { food: string; isOneDay: boolean }[];
  temporaryDislikes: { food: string; isOneDay: boolean }[];
}

interface UserContextType {
  user: User | null;
  teams: Team[];
  setUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    name: '김머핀',
    preferences: [],
    dislikes: []
  });
  const [teams, setTeams] = useState<Team[]>([]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // 사용자 선호도가 변경되면 모든 팀의 해당 사용자 정보도 업데이트
    setTeams(prevTeams => 
      prevTeams.map(team => ({
        ...team,
        members: team.members.map(member => 
          member.id === updatedUser.id 
            ? { ...member, preferences: updatedUser.preferences, dislikes: updatedUser.dislikes }
            : member
        )
      }))
    );
  };

  const addTeam = (team: Team) => {
    const newTeam = { ...team };
    
    // 팀 생성자의 선호도 자동 추가
    if (user && team.createdBy === user.id) {
      const userMember: TeamMember = {
        id: user.id,
        name: user.name,
        preferences: [...user.preferences],
        dislikes: [...user.dislikes],
        temporaryPreferences: [],
        temporaryDislikes: []
      };
      newTeam.members = [userMember];
    }
    
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (updatedTeam: Team) => {
    console.log('Updating team:', updatedTeam);
    setTeams(prev => {
      const newTeams = prev.map(team => 
        team.id === updatedTeam.id ? updatedTeam : team
      );
      console.log('New teams state:', newTeams);
      return newTeams;
    });
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  return (
    <UserContext.Provider value={{
      user,
      teams,
      setUser,
      updateUser,
      addTeam,
      updateTeam,
      deleteTeam
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export type { User, Team, TeamMember };
