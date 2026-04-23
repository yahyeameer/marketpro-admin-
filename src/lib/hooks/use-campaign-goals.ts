import { useState, useEffect } from 'react';

export interface CampaignGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  marketerName: string;
  status: 'active' | 'achieved';
  createdAt: string;
}

const defaultGoals: CampaignGoal[] = [
  { id: '1', title: 'Street Marketing Q2', target: 50, current: 32, marketerName: 'Alex Marketer', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', title: 'Downtown Promo', target: 20, current: 20, marketerName: 'Sarah Sales', status: 'achieved', createdAt: new Date().toISOString() },
];

export function useCampaignGoals() {
  const [goals, setGoals] = useState<CampaignGoal[]>(defaultGoals);

  useEffect(() => {
    const saved = localStorage.getItem('marketpro_campaign_goals');
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse goals', e);
      }
    } else {
      localStorage.setItem('marketpro_campaign_goals', JSON.stringify(defaultGoals));
    }
  }, []);

  const addGoal = (goal: Omit<CampaignGoal, 'id' | 'createdAt' | 'status' | 'current'>) => {
    const newGoal: CampaignGoal = {
      ...goal,
      id: crypto.randomUUID(),
      current: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    localStorage.setItem('marketpro_campaign_goals', JSON.stringify(updated));
  };

  const updateProgress = (id: string, newCurrent: number) => {
    let achievedGoalTitle = "";
    const updated = goals.map(g => {
      if (g.id === id) {
        const isAchieved = newCurrent >= g.target;
        if (isAchieved && g.status !== 'achieved') {
          achievedGoalTitle = g.title;
        }
        return { ...g, current: newCurrent, status: (isAchieved ? 'achieved' : 'active') as 'active' | 'achieved' };
      }
      return g;
    });
    setGoals(updated);
    localStorage.setItem('marketpro_campaign_goals', JSON.stringify(updated));
    return achievedGoalTitle;
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem('marketpro_campaign_goals', JSON.stringify(updated));
  };

  return { goals, addGoal, updateProgress, deleteGoal };
}
