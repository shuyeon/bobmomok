
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
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
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    name: '김머핀'
  });
  const [teams, setTeams] = useState<Team[]>([]);

  const addTeam = (team: Team) => {
    setTeams(prev => [...prev, team]);
  };

  const updateTeam = (updatedTeam: Team) => {
    setTeams(prev => prev.map(team => 
      team.id === updatedTeam.id ? updatedTeam : team
    ));
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  return (
    <UserContext.Provider value={{
      user,
      teams,
      setUser,
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
