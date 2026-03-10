import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { KPICard } from './KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Modal } from '@/components/ui/Modal';
import { ChantierForm } from '@/features/chantiers/components/ChantierForm';
import type { Project, Transaction, CashFlowData, Client } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface DashboardProps {
  projects: Project[];
  transactions: Transaction[];
  clients: Client[];
  onAddProject: (project: Project) => void;
}

// ============================================
// SOUS-COMPOSANT: CUSTOM TOOLTIP
// ============================================

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-[#E5E7EB]">
        <p className="text-sm font-medium text-[#111827] mb-2">{payload[0].payload.month}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {(entry.value / 1000000).toFixed(1)}M FCFA
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================
// COMPOSANT DASHBOARD
// ============================================

export function Dashboard({ projects, transactions, clients, onAddProject }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================
  // CALCULS DYNAMIQUES DES KPI
  // ============================================

  const dynamicKPIs = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Chiffre d'affaires du mois
    const caMonth = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'RECETTE' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // 2. Nombre de chantiers actifs
    const activeProjectsCount = projects.filter(p => p.status === 'en cours').length;

    // 3. Dépenses du mois
    const depensesMonth = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'DEPENSE' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // 4. Trésorerie globale
    const totalRecettes = transactions
      .filter(t => t.type === 'RECETTE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDepenses = transactions
      .filter(t => t.type === 'DEPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const tresorerie = totalRecettes - totalDepenses;

    // Calculer les tendances
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const caMonthPrevious = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'RECETTE' &&
          transactionDate.getMonth() === previousMonth &&
          transactionDate.getFullYear() === previousYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const caTrend = caMonthPrevious > 0
      ? ((caMonth - caMonthPrevious) / caMonthPrevious) * 100
      : 0;

    return {
      ca: {
        id: 'ca',
        title: "Chiffre d'affaires (Mois)",
        value: `${(caMonth / 1000000).toFixed(0)}M FCFA`,
        trend: {
          value: Math.abs(caTrend),
          isPositive: caTrend >= 0
        }
      },
      projects: {
        id: 'projects',
        title: 'Chantiers Actifs',
        value: activeProjectsCount.toString(),
        trend: undefined
      },
      depenses: {
        id: 'depenses',
        title: 'Dépenses (Mois)',
        value: `${(depensesMonth / 1000000).toFixed(0)}M FCFA`,
        trend: undefined
      },
      tresorerie: {
        id: 'tresorerie',
        title: 'Trésorerie Globale',
        value: `${(tresorerie / 1000000).toFixed(0)}M FCFA`,
        trend: {
          value: tresorerie > 0 ? 100 : 0,
          isPositive: tresorerie > 0
        }
      }
    };
  }, [transactions, projects]);

  // ============================================
  // CALCUL DYNAMIQUE DU GRAPHIQUE
  // ============================================

  const cashFlowData = useMemo(() => {
    const now = new Date();
    const data: CashFlowData[] = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = targetDate.toLocaleDateString('fr-FR', { month: 'short' });
      const year = targetDate.getFullYear();
      const monthIndex = targetDate.getMonth();

      const recettes = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return (
            t.type === 'RECETTE' &&
            transactionDate.getMonth() === monthIndex &&
            transactionDate.getFullYear() === year
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const depenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return (
            t.type === 'DEPENSE' &&
            transactionDate.getMonth() === monthIndex &&
            transactionDate.getFullYear() === year
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        month: month.charAt(0).toUpperCase() + month.slice(1),
        recettes: recettes,
        depenses: depenses
      });
    }

    return data;
  }, [transactions]);

  // ============================================
  // PROJETS RÉCENTS
  // ============================================

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5);
  }, [projects]);
  
  // ============================================
  // DONNÉES AFFICHÉES
  // ============================================
  
  const kpis = [
    dynamicKPIs.ca,
    dynamicKPIs.projects,
    dynamicKPIs.depenses,
    dynamicKPIs.tresorerie
  ];

  const currentDate = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // ============================================
  // HANDLERS
  // ============================================

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProject = (newProjectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...newProjectData,
      id: `PRJ-${Date.now()}`
    };
    
    onAddProject(newProject);
    handleCloseModal();
  };
  
  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-[#111827] mb-1 text-2xl sm:text-3xl">Vue d'ensemble</h1>
          <p className="text-sm text-[#6B7280] capitalize">{currentDate}</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nouveau Chantier</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.06)]">
            <h3 className="text-[#111827] mb-4 sm:mb-6 text-lg sm:text-xl">Flux de trésorerie (6 derniers mois)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={cashFlowData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="20%"
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000000}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="recettes" 
                  fill="#4F46E5" 
                  name="Recettes"
                  radius={[4, 4, 0, 0]}
                  minPointSize={5}
                />
                <Bar 
                  dataKey="depenses" 
                  fill="#6B7280" 
                  name="Dépenses"
                  radius={[4, 4, 0, 0]}
                  minPointSize={5}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.06)]">
            <h3 className="text-[#111827] mb-4 sm:mb-6 text-lg sm:text-xl">Projets Récents</h3>
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <p className="text-sm text-[#6B7280] text-center py-4">
                  Aucun projet enregistré
                </p>
              ) : (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/chantiers/${project.id}`}
                    className="flex items-start gap-3 w-full text-left hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className={`
                      w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${project.status === 'en cours' ? 'bg-[#4F46E5]' : project.status === 'terminé' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}
                    `} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#111827] leading-relaxed hover:text-[#4F46E5] transition-colors">
                        {project.name}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        {new Date(project.startDate).toLocaleDateString('fr-FR', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nouveau Chantier"
      >
        <ChantierForm
          onSubmit={handleCreateProject}
          onCancel={handleCloseModal}
          clients={clients}
        />
      </Modal>
    </div>
  );
}
