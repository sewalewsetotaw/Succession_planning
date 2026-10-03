import React, { useState } from 'react';
import {
  ActiveScreen,
  Employee,
  Position,
  SuccessionPlan,
  DevelopmentPlan,
  CandidateRating,
  Competency,
  ReadinessLevel,
  DevPlanStatus,
} from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_POSITIONS,
  INITIAL_SUCCESSION_PLANS,
  INITIAL_DEVELOPMENT_PLANS,
  INITIAL_CANDIDATE_RATINGS,
  COMPETENCIES,
  ORG_CHART_ROOT,
} from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { EmployeesScreen } from './components/screens/EmployeesScreen';
import { EmployeeDetailScreen } from './components/screens/EmployeeDetailScreen';
import { PositionsScreen } from './components/screens/PositionsScreen';
import { PositionDetailScreen } from './components/screens/PositionDetailScreen';
import { SuccessionPlansScreen } from './components/screens/SuccessionPlansScreen';
import { DevelopmentPlansScreen } from './components/screens/DevelopmentPlansScreen';
import { NineBoxGridScreen } from './components/screens/NineBoxGridScreen';
import { OrgChartScreen } from './components/screens/OrgChartScreen';
import { TalentRiskReportScreen } from './components/screens/TalentRiskReportScreen';
import { ReadinessTimelineScreen } from './components/screens/ReadinessTimelineScreen';
import { CompetencyHeatmapScreen } from './components/screens/CompetencyHeatmapScreen';
import { AddEditSuccessionPlanModal } from './components/modals/AddEditSuccessionPlanModal';
import { AddEditDevelopmentPlanModal } from './components/modals/AddEditDevelopmentPlanModal';
import { EditCompetencyRatingModal } from './components/modals/EditCompetencyRatingModal';
import { CriticalPositionMethodModal } from './components/modals/CriticalPositionMethodModal';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(INITIAL_EMPLOYEES[1].id);
  const [selectedPositionId, setSelectedPositionId] = useState<string>(INITIAL_POSITIONS[0].id);

  // Application Data State
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [successionPlans, setSuccessionPlans] = useState<SuccessionPlan[]>(INITIAL_SUCCESSION_PLANS);
  const [developmentPlans, setDevelopmentPlans] = useState<DevelopmentPlan[]>(INITIAL_DEVELOPMENT_PLANS);
  const [candidateRatings, setCandidateRatings] = useState<CandidateRating[]>(INITIAL_CANDIDATE_RATINGS);

  // Modals State
  const [isSuccessionModalOpen, setIsSuccessionModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<SuccessionPlan | null>(null);
  const [initialSuccessionReadiness, setInitialSuccessionReadiness] = useState<ReadinessLevel | undefined>(undefined);

  const [isDevPlanModalOpen, setIsDevPlanModalOpen] = useState(false);
  const [devPlanToEdit, setDevPlanToEdit] = useState<DevelopmentPlan | null>(null);
  const [initialDevPlanStatus, setInitialDevPlanStatus] = useState<DevPlanStatus | undefined>(undefined);

  const [isEditRatingModalOpen, setIsEditRatingModalOpen] = useState(false);
  const [ratingCandidate, setRatingCandidate] = useState<CandidateRating | null>(null);
  const [ratingCompetency, setRatingCompetency] = useState<Competency | null>(null);

  const [isCriticalMethodModalOpen, setIsCriticalMethodModalOpen] = useState(false);

  // Counters for badges
  const zeroSuccessorsCount = positions.filter((p) => p.successorsCount === 0).length;
  const highFlightRiskCount = employees.filter(
    (e) => e.flightRisk === 'Critical' || e.flightRisk === 'High'
  ).length;
  const overduePlansCount = developmentPlans.filter((p) => p.isOverdue).length;

  // Selected Employee & Position objects
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  const selectedPosition = positions.find((p) => p.id === selectedPositionId) || positions[0];
  const selectedEmployeeRating = candidateRatings.find((r) => r.candidateId === selectedEmployee.id);

  // Screen selection handlers
  const handleSelectEmployee = (empId: string) => {
    setSelectedEmployeeId(empId);
    setCurrentScreen('employee-detail');
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPosition = (posId: string) => {
    setSelectedPositionId(posId);
    setCurrentScreen('position-detail');
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (screen: ActiveScreen) => {
    setCurrentScreen(screen);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Succession Plan CRUD
  const handleSaveSuccessionPlan = (planData: Partial<SuccessionPlan>) => {
    if (planData.id) {
      // Edit
      setSuccessionPlans((prev) =>
        prev.map((p) => (p.id === planData.id ? ({ ...p, ...planData } as SuccessionPlan) : p))
      );
    } else {
      // Add
      const newPlan: SuccessionPlan = {
        id: `sp-${Date.now()}`,
        positionId: planData.positionId || positions[0].id,
        positionTitle: planData.positionTitle || positions[0].title,
        department: planData.department || positions[0].department,
        candidateId: planData.candidateId || employees[0].id,
        candidateName: planData.candidateName || employees[0].name,
        candidateTitle: planData.candidateTitle || employees[0].title,
        candidateAvatar: planData.candidateAvatar || employees[0].avatar,
        readiness: planData.readiness || '1-2 Years',
        ranking: planData.ranking || 1,
        performanceScore: planData.performanceScore || 4.5,
        potentialScore: planData.potentialScore || 4.5,
        flightRisk: planData.flightRisk || 'Low',
        notes: planData.notes || '',
        lastReviewed: new Date().toISOString().split('T')[0],
      };
      setSuccessionPlans((prev) => [newPlan, ...prev]);

      // Update position successor count
      setPositions((prev) =>
        prev.map((pos) =>
          pos.id === newPlan.positionId ? { ...pos, successorsCount: pos.successorsCount + 1 } : pos
        )
      );
    }
  };

  const handleDeleteSuccessionPlan = (planId: string) => {
    const plan = successionPlans.find((p) => p.id === planId);
    setSuccessionPlans((prev) => prev.filter((p) => p.id !== planId));
    if (plan) {
      setPositions((prev) =>
        prev.map((pos) =>
          pos.id === plan.positionId
            ? { ...pos, successorsCount: Math.max(0, pos.successorsCount - 1) }
            : pos
        )
      );
    }
  };

  // Development Plan CRUD
  const handleSaveDevelopmentPlan = (planData: Partial<DevelopmentPlan>) => {
    if (planData.id) {
      setDevelopmentPlans((prev) =>
        prev.map((p) => (p.id === planData.id ? ({ ...p, ...planData } as DevelopmentPlan) : p))
      );
    } else {
      const newDevPlan: DevelopmentPlan = {
        id: `dp-${Date.now()}`,
        goal: planData.goal || 'Executive Leadership Goal',
        employeeId: planData.employeeId || employees[0].id,
        employeeName: planData.employeeName || employees[0].name,
        employeeTitle: planData.employeeTitle || employees[0].title,
        employeeAvatar: planData.employeeAvatar || employees[0].avatar,
        category: planData.category || 'Leadership',
        status: planData.status || 'In Progress',
        dueDate: planData.dueDate || '2026-12-31',
        isOverdue: false,
        progressPercent: planData.progressPercent || 25,
        targetPositionId: planData.targetPositionId,
        targetPositionTitle: planData.targetPositionTitle,
        mentorName: planData.mentorName,
        notes: planData.notes,
      };
      setDevelopmentPlans((prev) => [newDevPlan, ...prev]);
    }
  };

  const handleDeleteDevelopmentPlan = (planId: string) => {
    setDevelopmentPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const handleUpdateDevPlanStatus = (planId: string, newStatus: DevPlanStatus) => {
    setDevelopmentPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const isCompleted = newStatus === 'Completed';
        return {
          ...p,
          status: newStatus,
          progressPercent: isCompleted ? 100 : p.progressPercent === 100 ? 50 : p.progressPercent,
          isOverdue: isCompleted ? false : p.isOverdue,
        };
      })
    );
  };

  const handleUpdateSuccessionReadiness = (planId: string, newReadiness: ReadinessLevel) => {
    setSuccessionPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, readiness: newReadiness } : p))
    );
  };

  const handleUpdateEmployee = (empId: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, ...updates } : emp))
    );
  };

  // Competency Rating Edit
  const handleSaveCompetencyRating = (
    candidateId: string,
    competencyId: string,
    current: number,
    target: number
  ) => {
    setCandidateRatings((prev) =>
      prev.map((cand) => {
        if (cand.candidateId !== candidateId) return cand;
        return {
          ...cand,
          ratings: {
            ...cand.ratings,
            [competencyId]: { current, target, assessed: true },
          },
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#0B1F18] flex flex-col font-sans">
      <div className="flex flex-1 min-w-0">
        {/* Left deep emerald (#064E3B) sidebar with 10 modules + pinned BRD reference */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          zeroSuccessorsCount={zeroSuccessorsCount}
          highFlightRiskCount={highFlightRiskCount}
          overduePlansCount={overduePlansCount}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            zeroSuccessorsCount={zeroSuccessorsCount}
          />

          {/* Viewport Content Container (1440px target layout) */}
          <main className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto">
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                employees={employees}
                positions={positions}
                successionPlans={successionPlans}
                developmentPlans={developmentPlans}
                onNavigate={handleNavigate}
                onSelectEmployee={handleSelectEmployee}
                onSelectPosition={handleSelectPosition}
              />
            )}

                {currentScreen === 'employees' && (
                  <EmployeesScreen
                    employees={employees}
                    onSelectEmployee={handleSelectEmployee}
                    onUpdateEmployee={handleUpdateEmployee}
                    searchQuery={searchQuery}
                  />
                )}

                {currentScreen === 'employee-detail' && (
                  <EmployeeDetailScreen
                    employee={selectedEmployee}
                    allEmployees={employees}
                    successionPlans={successionPlans}
                    developmentPlans={developmentPlans}
                    candidateRating={selectedEmployeeRating}
                    competencies={COMPETENCIES}
                    onBack={() => handleNavigate('employees')}
                    onSelectEmployee={handleSelectEmployee}
                    onSelectPosition={handleSelectPosition}
                    onEditCompetency={(c, comp) => {
                      setRatingCandidate(c);
                      setRatingCompetency(comp);
                      setIsEditRatingModalOpen(true);
                    }}
                  />
                )}

                {currentScreen === 'positions' && (
                  <PositionsScreen
                    positions={positions}
                    onSelectPosition={handleSelectPosition}
                    onNavigate={handleNavigate}
                    onOpenMethodology={() => setIsCriticalMethodModalOpen(true)}
                  />
                )}

                {currentScreen === 'position-detail' && (
                  <PositionDetailScreen
                    position={selectedPosition}
                    successionPlans={successionPlans}
                    employees={employees}
                    onBack={() => handleNavigate('positions')}
                    onSelectEmployee={handleSelectEmployee}
                    onNavigate={handleNavigate}
                    onAddSuccessor={() => {
                      setPlanToEdit(null);
                      setIsSuccessionModalOpen(true);
                    }}
                    onOpenMethodology={() => setIsCriticalMethodModalOpen(true)}
                  />
                )}

                {currentScreen === 'succession-plans' && (
                  <SuccessionPlansScreen
                    successionPlans={successionPlans}
                    positions={positions}
                    employees={employees}
                    onAddPlan={(readiness) => {
                      setPlanToEdit(null);
                      setInitialSuccessionReadiness(readiness);
                      setIsSuccessionModalOpen(true);
                    }}
                    onEditPlan={(plan) => {
                      setPlanToEdit(plan);
                      setIsSuccessionModalOpen(true);
                    }}
                    onDeletePlan={handleDeleteSuccessionPlan}
                    onSelectEmployee={handleSelectEmployee}
                    onSelectPosition={handleSelectPosition}
                    onUpdateReadiness={handleUpdateSuccessionReadiness}
                  />
                )}

                {currentScreen === 'development-plans' && (
                  <DevelopmentPlansScreen
                    developmentPlans={developmentPlans}
                    employees={employees}
                    onAddPlan={(status) => {
                      setDevPlanToEdit(null);
                      setInitialDevPlanStatus(status);
                      setIsDevPlanModalOpen(true);
                    }}
                    onEditPlan={(plan) => {
                      setDevPlanToEdit(plan);
                      setIsDevPlanModalOpen(true);
                    }}
                    onDeletePlan={handleDeleteDevelopmentPlan}
                    onSelectEmployee={handleSelectEmployee}
                    onUpdateStatus={handleUpdateDevPlanStatus}
                  />
                )}

                {currentScreen === 'nine-box' && (
                  <NineBoxGridScreen
                    employees={employees}
                    onSelectEmployee={handleSelectEmployee}
                    onNavigate={handleNavigate}
                    onUpdateEmployee={handleUpdateEmployee}
                  />
                )}

                {currentScreen === 'org-chart' && (
                  <OrgChartScreen
                    rootNode={ORG_CHART_ROOT}
                    employees={employees}
                    positions={positions}
                    onSelectEmployee={handleSelectEmployee}
                    onSelectPosition={handleSelectPosition}
                    onNavigate={handleNavigate}
                  />
                )}

                {currentScreen === 'talent-risk' && (
                  <TalentRiskReportScreen
                    positions={positions}
                    employees={employees}
                    developmentPlans={developmentPlans}
                    successionPlans={successionPlans}
                    onSelectPosition={handleSelectPosition}
                    onSelectEmployee={handleSelectEmployee}
                    onNavigate={handleNavigate}
                  />
                )}

                {currentScreen === 'readiness-timeline' && (
                  <ReadinessTimelineScreen
                    successionPlans={successionPlans}
                    positions={positions}
                    employees={employees}
                    onSelectEmployee={handleSelectEmployee}
                    onSelectPosition={handleSelectPosition}
                  />
                )}

                {currentScreen === 'competency-heatmap' && (
                  <CompetencyHeatmapScreen
                    competencies={COMPETENCIES}
                    candidateRatings={candidateRatings}
                    onEditRating={(candidate, comp) => {
                      setRatingCandidate(candidate);
                      setRatingCompetency(comp);
                      setIsEditRatingModalOpen(true);
                    }}
                    onSelectEmployee={handleSelectEmployee}
                  />
                )}
          </main>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <AddEditSuccessionPlanModal
        isOpen={isSuccessionModalOpen}
        onClose={() => setIsSuccessionModalOpen(false)}
        onSave={handleSaveSuccessionPlan}
        planToEdit={planToEdit}
        initialReadiness={initialSuccessionReadiness}
        employees={employees}
        positions={positions}
      />

      <AddEditDevelopmentPlanModal
        isOpen={isDevPlanModalOpen}
        onClose={() => setIsDevPlanModalOpen(false)}
        onSave={handleSaveDevelopmentPlan}
        planToEdit={devPlanToEdit}
        initialStatus={initialDevPlanStatus}
        employees={employees}
        positions={positions}
      />

      <EditCompetencyRatingModal
        isOpen={isEditRatingModalOpen}
        onClose={() => setIsEditRatingModalOpen(false)}
        onSave={handleSaveCompetencyRating}
        candidateRating={ratingCandidate}
        competency={ratingCompetency}
      />

      <CriticalPositionMethodModal
        isOpen={isCriticalMethodModalOpen}
        onClose={() => setIsCriticalMethodModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
