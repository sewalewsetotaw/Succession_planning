export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Not assessed';
export type CriticalityLevel = 'Critical' | 'High' | 'Medium';
export type ReadinessLevel = 'Ready Now' | '1-2 Years' | '3-5 Years';
export type DevPlanStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';
export type DevPlanCategory = 'Leadership' | 'Technical' | 'Communication' | 'Strategic' | 'Other';

export interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
  level: string; // 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10'
  email: string;
  yearsExperience: number;
  managerId: string | null;
  managerName: string | null;
  avatar: string;
  performanceScore: number; // 1.0 - 5.0
  potentialScore: number; // 1.0 - 5.0
  flightRisk: RiskLevel;
  flightRiskRationale?: string;
  retirementRisk: RiskLevel;
  retireYears: number | null;
  boxGridPosition: string;
  dateAdded: string;
  isKeyTalent: boolean;
}

export interface CriticalityFactors {
  strategicImpact: number; // 25% (0-100)
  operationalContinuity: number; // 20%
  customerRevenue: number; // 15%
  scarcity: number; // 15%
  regulatoryReputational: number; // 10%
  timeToCompetence: number; // 10%
  vacancyExposure: number; // 5%
}

export interface Position {
  id: string;
  title: string;
  department: string;
  criticality: CriticalityLevel;
  criticalityScore: number; // calculated weighted score 0-100
  criticalityFactors: CriticalityFactors;
  incumbentId: string;
  incumbentName: string;
  incumbentAvatar: string;
  successorsCount: number;
  avgTimeToReadinessMonths: number;
  description: string;
  minSuccessorsRequired: number;
}

export interface SuccessionPlan {
  id: string;
  positionId: string;
  positionTitle: string;
  department: string;
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  candidateAvatar: string;
  readiness: ReadinessLevel;
  ranking: number; // 1 = Primary, 2 = Secondary, 3 = Long-term
  performanceScore: number;
  potentialScore: number;
  flightRisk: RiskLevel;
  notes: string;
  lastReviewed: string;
}

export interface DevelopmentPlan {
  id: string;
  goal: string;
  employeeId: string;
  employeeName: string;
  employeeTitle: string;
  employeeAvatar: string;
  category: DevPlanCategory;
  status: DevPlanStatus;
  dueDate: string;
  isOverdue: boolean;
  progressPercent: number;
  targetPositionId?: string;
  targetPositionTitle?: string;
  mentorName?: string;
  notes?: string;
}

export interface Competency {
  id: string;
  name: string;
  category: 'Leadership' | 'Technical' | 'Communication' | 'Strategic';
  description: string;
}

export interface CandidateRating {
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  candidateAvatar: string;
  targetPositionId: string;
  targetPositionTitle: string;
  department: string;
  ratings: Record<string, { current: number; target: number; assessed: boolean }>;
}

export interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  level: number;
  isSuccessorAssigned: boolean;
  successorsReadyNow: number;
  totalSuccessors: number;
  children?: OrgNode[];
}

export type ActiveScreen = 
  | 'dashboard'
  | 'employees'
  | 'employee-detail'
  | 'positions'
  | 'position-detail'
  | 'succession-plans'
  | 'development-plans'
  | 'nine-box'
  | 'org-chart'
  | 'talent-risk'
  | 'readiness-timeline'
  | 'competency-heatmap';
