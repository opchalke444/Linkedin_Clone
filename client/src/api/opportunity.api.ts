import api from './client';
import { OpportunityItem } from '../types';

export const opportunityApi = {
  getOpportunities: (): Promise<{ success: boolean; data: OpportunityItem[] }> =>
    api.get('/opportunities'),

  applyToOpportunity: (id: string): Promise<{ success: boolean; data: any }> =>
    api.post(`/opportunities/${id}/apply`),

  apply: (id: string): Promise<{ success: boolean; data: any }> =>
    api.post(`/opportunities/${id}/apply`),
};
