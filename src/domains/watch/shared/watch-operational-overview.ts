export type WatchRelatedWork = {
  id: string; title: string; status: string; assignee: string | null;
  updatedAt: string; completedAt: string | null;
};
export type WatchOperationalOverview = {
  sale: string; stock: string; consignment: string;
  serviceCompleted: number; serviceOpen: number;
  workVisible: boolean; active: WatchRelatedWork[]; completed: WatchRelatedWork[];
};
