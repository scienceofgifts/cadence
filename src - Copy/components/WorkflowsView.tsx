import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Workflow,
  Plus,
  Play,
  Check,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Layers,
  Sparkles,
  RotateCcw,
  Trash2,
  Sliders,
  ExternalLink,
  BookOpen,
  Copy,
  Edit3,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { GeneratedWorkflowStep, WorkflowTemplate, ProjectWorkflow } from '../types/workflow';
import { WorkflowConceptStoryboard } from './WorkflowConceptStoryboard';
import { WorkflowEditor } from './WorkflowEditor';

export const WorkflowsView: React.FC = () => {
  const {
    workflows,
    activeWorkflowId,
    setActiveWorkflowId,
    getActiveWorkflow,
    getWhatsNextState,
    templates,
    saveWorkflowTemplate,
    deleteWorkflowTemplate,
    duplicateWorkflowTemplate,
    createWorkflowFromTemplate,
    updateWorkflowProject,
    duplicateWorkflowProject,
    completeWorkflowStep,
    startWorkflowFocus,
    deleteWorkflow,
    resetWorkflowProgress,
  } = useTask();

  // Tab mode: Active Projects roadmap vs Saved Workflow Templates
  const [activeTab, setActiveTab] = useState<'projects' | 'templates'>('projects');

  // Workflow Editor State (for Templates)
  const [isEditingTemplate, setIsEditingTemplate] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);

  // Delete Confirmation Modal State (Templates)
  const [templateToDelete, setTemplateToDelete] = useState<WorkflowTemplate | null>(null);

  // Active Dropdown Action Menu for Templates
  const [activeMenuTemplateId, setActiveMenuTemplateId] = useState<string | null>(null);

  // Workflow Project Edit & Delete State
  const [editingProject, setEditingProject] = useState<ProjectWorkflow | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectItemCount, setEditProjectItemCount] = useState<number>(10);
  const [editProjectCollection, setEditProjectCollection] = useState('');
  const [showReduceConfirm, setShowReduceConfirm] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState<ProjectWorkflow | null>(null);
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);

  // Create Project Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showStoryboardModal, setShowStoryboardModal] = useState(false);

  // Form State for Create Project
  const defaultTpl = templates[0] || null;
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    defaultTpl ? defaultTpl.id : 'gift-guide'
  );
  const [formName, setFormName] = useState(defaultTpl?.inputs.defaultName || 'WWII Gifts');
  const [formItemCount, setFormItemCount] = useState(defaultTpl?.inputs.defaultItemCount || 10);
  const [formCollection, setFormCollection] = useState(defaultTpl?.inputs.defaultCollection || 'History / WWII');

  // Accordion state for products in roadmap
  const [expandedProductIndices, setExpandedProductIndices] = useState<Record<number, boolean>>({});

  // Ensure selectedTemplateId points to a valid template if available
  useEffect(() => {
    if (templates.length > 0) {
      const exists = templates.some((t) => t.id === selectedTemplateId);
      if (!exists) {
        const first = templates[0];
        setSelectedTemplateId(first.id);
        setFormName(first.inputs.defaultName || first.name);
        setFormItemCount(first.inputs.defaultItemCount || 10);
        setFormCollection(first.inputs.defaultCollection || 'General');
      }
    }
  }, [templates, selectedTemplateId]);

  const activeWorkflow = getActiveWorkflow();
  const currentSelectedTemplate =
    templates.find((t) => t.id === selectedTemplateId) || defaultTpl;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedTemplate) return;
    createWorkflowFromTemplate(selectedTemplateId, formName, formItemCount, formCollection);
    setIsCreateModalOpen(false);
    setActiveTab('projects');
  };

  const toggleProductAccordion = (idx: number) => {
    setExpandedProductIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // If user opens the blueprint view
  if (showStoryboardModal) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowStoryboardModal(false)}
            className="text-xs font-bold text-[#1B3D5F] dark:text-[#99BFF9] hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Return to Live Workflow Engine
          </button>
          <span className="text-[11px] font-mono text-slate-400">8-Stage Architecture Blueprint</span>
        </div>
        <WorkflowConceptStoryboard />
      </div>
    );
  }

  // If user is editing or creating a workflow template
  if (isEditingTemplate) {
    return (
      <WorkflowEditor
        initialTemplate={editingTemplate}
        onSave={(savedTpl) => {
          saveWorkflowTemplate(savedTpl);
          setIsEditingTemplate(false);
          setEditingTemplate(null);
          setActiveTab('templates');
        }}
        onCancel={() => {
          setIsEditingTemplate(false);
          setEditingTemplate(null);
        }}
      />
    );
  }

  // Calculate current active step for Active Project
  const whatsNext = getWhatsNextState();
  const currentStep = activeWorkflow?.generatedSteps.find((s) => !s.completed);
  const isAllComplete = activeWorkflow && activeWorkflow.generatedSteps.every((s) => s.completed);

  // Group steps by product index (1..itemCount)
  const productGroups: Record<number, GeneratedWorkflowStep[]> = {};
  const finalSteps: GeneratedWorkflowStep[] = [];

  if (activeWorkflow) {
    activeWorkflow.generatedSteps.forEach((st) => {
      if (st.stageType === 'repeat' && st.itemIndex) {
        if (!productGroups[st.itemIndex]) productGroups[st.itemIndex] = [];
        productGroups[st.itemIndex].push(st);
      } else if (st.stageType === 'final') {
        finalSteps.push(st);
      }
    });
  }

  const allProductStepsComplete =
    activeWorkflow &&
    activeWorkflow.generatedSteps
      .filter((s) => s.stageType === 'repeat')
      .every((s) => s.completed);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Top Workspace Header */}
      <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 sm:p-7 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#99BFF9]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 font-display">
              Guided Workflows
            </h1>
          </div>
          <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
            Define repeatable creation pipelines once and let Cadence guide your daily execution.
          </p>
        </div>

        {/* Tab Selector & Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Active Projects ({workflows.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Workflow Templates ({templates.length})
            </button>
          </div>

          <button
            onClick={() => setShowStoryboardModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#1B3D5F] bg-[#FAF9F6] dark:bg-slate-800/80 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            title="View the 8-stage visual architecture storyboard"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Blueprint</span>
          </button>

          {activeTab === 'templates' ? (
            <button
              onClick={() => {
                setEditingTemplate(null);
                setIsEditingTemplate(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Workflow</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Project</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          TAB 1: WORKFLOW TEMPLATES MANAGEMENT
         ======================================================== */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-bold text-[#1B3D5F] dark:text-slate-100">
                Workflow Templates
              </h2>
              <p className="text-xs font-editorial italic text-slate-500">
                Recipes for future projects. Editing or deleting templates does not modify existing projects in progress.
              </p>
            </div>
            {templates.length > 0 && (
              <button
                onClick={() => {
                  setEditingTemplate(null);
                  setIsEditingTemplate(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Workflow</span>
              </button>
            )}
          </div>

          {templates.length === 0 ? (
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-8 sm:p-12 border border-[#1B3D5F]/10 dark:border-slate-800 text-center space-y-4 max-w-md mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] flex items-center justify-center mx-auto">
                <Workflow className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-100">
                  NO WORKFLOWS YET
                </h3>
                <p className="text-xs sm:text-sm font-editorial italic text-slate-500 dark:text-slate-400">
                  Create a workflow to define a repeatable process.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTemplate(null);
                  setIsEditingTemplate(true);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-95 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Create Workflow</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((tpl) => {
                const setupCount = tpl.initialSteps?.length || 0;
                const repeatCount = tpl.repeatBlock?.steps?.length || 0;
                const finalCount = tpl.finalSteps?.length || 0;
                const itemLabel = tpl.repeatBlock?.itemLabel || 'Product';
                const isMenuOpen = activeMenuTemplateId === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    className="bg-white dark:bg-[#142438] rounded-2xl p-5 border border-[#1B3D5F]/15 dark:border-slate-800 shadow-xs hover:border-[#99BFF9] dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-4 relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-[#1B3D5F] dark:text-slate-100">
                              {tpl.name}
                            </h3>
                            {tpl.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9]">
                                {tpl.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-editorial italic text-slate-500 line-clamp-2">
                            {tpl.description}
                          </p>
                        </div>
                      </div>

                      {/* Structure Breakdown */}
                      <div className="p-3 bg-[#FAF9F6] dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1.5 font-mono">
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Setup:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {setupCount > 0 ? `${setupCount} step${setupCount > 1 ? 's' : ''}` : 'None'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="text-[10px] uppercase font-bold text-[#1B3D5F] dark:text-[#99BFF9]">
                            Repeat per {itemLabel}:
                          </span>
                          <span className="font-bold text-[#1B3D5F] dark:text-slate-200">
                            {repeatCount} step{repeatCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            After All {itemLabel}s:
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {finalCount} stage{finalCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                      <button
                        onClick={() => {
                          setSelectedTemplateId(tpl.id);
                          setFormName(tpl.inputs.defaultName || tpl.name);
                          setFormItemCount(tpl.inputs.defaultItemCount || 10);
                          setFormCollection(tpl.inputs.defaultCollection || 'General');
                          setIsCreateModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] rounded-xl text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Project</span>
                      </button>

                      <div className="flex items-center gap-1 relative">
                        <button
                          onClick={() => {
                            setEditingTemplate(tpl);
                            setIsEditingTemplate(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B3D5F] dark:hover:text-white bg-[#FAF9F6] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Edit workflow template"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Dropdown Menu Trigger */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuTemplateId(isMenuOpen ? null : tpl.id);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isMenuOpen
                                ? 'bg-slate-200 dark:bg-slate-700 text-[#1B3D5F] dark:text-white border-slate-300 dark:border-slate-600'
                                : 'text-slate-500 hover:text-[#1B3D5F] dark:hover:text-slate-200 bg-[#FAF9F6] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                            }`}
                            title="More workflow actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setActiveMenuTemplateId(null)}
                              />
                              <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-white dark:bg-[#142438] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                                <button
                                  onClick={() => {
                                    setActiveMenuTemplateId(null);
                                    setEditingTemplate(tpl);
                                    setIsEditingTemplate(true);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Edit Workflow</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuTemplateId(null);
                                    duplicateWorkflowTemplate(tpl.id);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Duplicate Workflow</span>
                                </button>

                                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                <button
                                  onClick={() => {
                                    setActiveMenuTemplateId(null);
                                    setTemplateToDelete(tpl);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer text-left transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Workflow</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: ACTIVE PROJECTS & ROADMAP EXECUTION
         ======================================================== */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Workflow Selector Bar (if multiple workflows exist) */}
          {workflows.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider pl-1">
                Projects:
              </span>
              {workflows.map((wf) => {
                const isActive = wf.id === activeWorkflow?.id;
                const isProjectMenuOpen = activeMenuProjectId === `switcher-${wf.id}`;

                return (
                  <div key={wf.id} className="relative flex items-center shrink-0">
                    <button
                      onClick={() => setActiveWorkflowId(wf.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#1B3D5F] text-white border-[#1B3D5F] font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{wf.projectName}</span>
                      <span className="text-[10px] opacity-75 font-mono">({wf.itemCount} items)</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuProjectId(isProjectMenuOpen ? null : `switcher-${wf.id}`);
                      }}
                      className={`ml-1 p-1 rounded-lg border transition-colors cursor-pointer ${
                        isProjectMenuOpen
                          ? 'bg-slate-200 dark:bg-slate-700 text-[#1B3D5F] dark:text-white border-slate-300'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Project actions"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {/* Switcher Item Menu */}
                    {isProjectMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveMenuProjectId(null)}
                        />
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-[#142438] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              setActiveWorkflowId(wf.id);
                              setEditingProject(wf);
                              setEditProjectName(wf.projectName);
                              setEditProjectItemCount(wf.itemCount);
                              setEditProjectCollection(wf.collection);
                              setShowReduceConfirm(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit Project</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              duplicateWorkflowProject(wf.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Duplicate Project</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              if (window.confirm(`Reset progress for "${wf.projectName}" back to Step 1?`)) {
                                resetWorkflowProgress(wf.id);
                              }
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Reset Progress</span>
                          </button>

                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              setProjectToDelete(wf);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer text-left transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Project</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeWorkflow ? (
            <div className="space-y-6">
              {/* Active Project Meta Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Active Project:
                  </span>
                  <span className="text-base font-bold text-[#1B3D5F] dark:text-slate-100">
                    {activeWorkflow.projectName}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {activeWorkflow.collection}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9]">
                    {activeWorkflow.itemCount} products
                  </span>
                </div>

                <div className="flex items-center gap-1.5 relative self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setEditingProject(activeWorkflow);
                      setEditProjectName(activeWorkflow.projectName);
                      setEditProjectItemCount(activeWorkflow.itemCount);
                      setEditProjectCollection(activeWorkflow.collection);
                      setShowReduceConfirm(false);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B3D5F] dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="Edit project details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Project</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuProjectId(activeMenuProjectId === 'banner' ? null : 'banner');
                      }}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        activeMenuProjectId === 'banner'
                          ? 'bg-slate-200 dark:bg-slate-700 text-[#1B3D5F] dark:text-white border-slate-300'
                          : 'text-slate-500 hover:text-[#1B3D5F] dark:hover:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                      }`}
                      title="Project actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Banner Action Menu */}
                    {activeMenuProjectId === 'banner' && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveMenuProjectId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#142438] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              setEditingProject(activeWorkflow);
                              setEditProjectName(activeWorkflow.projectName);
                              setEditProjectItemCount(activeWorkflow.itemCount);
                              setEditProjectCollection(activeWorkflow.collection);
                              setShowReduceConfirm(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit Project</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              duplicateWorkflowProject(activeWorkflow.id);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Duplicate Project</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              if (window.confirm(`Reset progress for "${activeWorkflow.projectName}" back to Step 1?`)) {
                                resetWorkflowProgress(activeWorkflow.id);
                              }
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Reset Progress</span>
                          </button>

                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              setProjectToDelete(activeWorkflow);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer text-left transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Project</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* WHAT'S NEXT HERO (CENTERPIECE) */}
              <div className="bg-gradient-to-br from-white via-white to-[#FAF9F6] dark:from-[#142438] dark:to-[#0C1724] rounded-2xl p-6 sm:p-8 border-2 border-[#1B3D5F]/15 dark:border-slate-700 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#99BFF9] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-[#99BFF9] font-sans">
                      WHAT'S NEXT
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-slate-200 font-bold uppercase tracking-wider">
                      Guided Workflow
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {isAllComplete ? 'Status: Complete' : 'Next Action'}
                  </span>
                </div>

                {currentStep && whatsNext ? (
                  <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-xl">
                      {/* Project Name (Cormorant Garamond / Lora Serif) & What's Next Label (Serif) */}
                      <div className="space-y-1">
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#1B3D5F] dark:text-slate-100">
                          {whatsNext.projectName}
                        </h2>
                        <div className="font-serif text-xs font-semibold uppercase tracking-widest text-[#28537D] dark:text-[#99BFF9]">
                          What's Next
                        </div>
                      </div>

                      {/* Question 3: Current Step (clean sans-serif, uppercase) & Category/Product count (sans-serif, muted) */}
                      <div className="space-y-1">
                        <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#1B3D5F] dark:text-slate-100 uppercase leading-tight">
                          {currentStep.stepTitle}
                        </h3>
                        <p className="font-sans text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                          {currentStep.categoryLabel}
                        </p>
                      </div>

                      {/* Question 4: What did I just finish? */}
                      {whatsNext.completedInItem.length > 0 && (
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            {whatsNext.completedInItem.map((item) => (
                              <span
                                key={item}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#C3F3DF]/30 dark:bg-emerald-950/40 text-[#1B3D5F] dark:text-emerald-300 border border-[#88C1A8]/40 dark:border-emerald-700/50 font-sans"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {whatsNext.completedInItem.length === 0 && whatsNext.justFinishedContext && (
                        <div className="pt-0.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#C3F3DF]/30 dark:bg-emerald-950/40 text-[#1B3D5F] dark:text-emerald-300 border border-[#88C1A8]/40 dark:border-emerald-700/50 font-sans">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                            <span>{whatsNext.justFinishedContext}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Question 5: Action & What comes after this? */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startWorkflowFocus(currentStep.id, activeWorkflow.id)}
                          className="font-sans flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 shadow-sm active:scale-98 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Start Focus</span>
                        </button>

                        <button
                          onClick={() => completeWorkflowStep(currentStep.id, activeWorkflow.id)}
                          className="font-sans flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
                          title="Mark step complete"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>
                      </div>

                      <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <span>After this:</span>
                        <span className="text-[#1B3D5F] dark:text-slate-200 font-bold">
                          → {whatsNext.nextStepLabel || whatsNext.nextStepTitle || 'Workflow Complete'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#C3F3DF]/40 text-[#88C1A8] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                      All Steps Finished!
                    </h3>
                    <p className="text-xs font-editorial italic text-slate-500">
                      Every product loop and guide publishing stage has been completed cleanly.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => resetWorkflowProgress(activeWorkflow.id)}
                        className="px-4 py-2 text-xs font-semibold text-[#1B3D5F] dark:text-slate-100 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                      >
                        Reset Workflow for Testing
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* GENERATED ROADMAP VIEW */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-base font-bold text-[#1B3D5F] dark:text-slate-100">
                      Generated Execution Roadmap
                    </h3>
                    <p className="text-xs font-editorial italic text-slate-500">
                      {activeWorkflow.itemCount} items · repeatable loop + linear publishing stages
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {activeWorkflow.generatedSteps.filter((s) => s.completed).length} /{' '}
                    {activeWorkflow.generatedSteps.length} complete
                  </span>
                </div>

                {/* Product Loops Accordion Grid */}
                <div className="space-y-3">
                  {Object.keys(productGroups).map((key) => {
                    const itemIdx = Number(key);
                    const stepsInGroup = productGroups[itemIdx];
                    const isGroupComplete = stepsInGroup.every((s) => s.completed);
                    const hasCurrentStep = stepsInGroup.some((s) => s.id === currentStep?.id);
                    const isExpanded =
                      expandedProductIndices[itemIdx] !== undefined
                        ? expandedProductIndices[itemIdx]
                        : hasCurrentStep;

                    return (
                      <div
                        key={itemIdx}
                        className={`rounded-2xl border transition-all ${
                          hasCurrentStep
                            ? 'bg-white dark:bg-[#142438] border-2 border-[#99BFF9] shadow-sm'
                            : isGroupComplete
                            ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
                            : 'bg-white dark:bg-[#142438] border-[#1B3D5F]/10 dark:border-slate-800'
                        }`}
                      >
                        {/* Header */}
                        <div
                          onClick={() => toggleProductAccordion(itemIdx)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
                                isGroupComplete
                                  ? 'bg-[#C3F3DF]/40 text-[#88C1A8]'
                                  : hasCurrentStep
                                  ? 'bg-[#99BFF9] text-[#1B3D5F]'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {isGroupComplete ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : itemIdx}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#1B3D5F] dark:text-slate-100">
                                  ITEM {String(itemIdx).padStart(2, '0')}
                                </span>
                                {hasCurrentStep && (
                                  <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase bg-[#99BFF9]/30 text-[#1B3D5F] dark:text-[#99BFF9]">
                                    In Progress
                                  </span>
                                )}
                                {isGroupComplete && (
                                  <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase bg-[#C3F3DF]/40 text-[#88C1A8]">
                                    Done
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-mono text-slate-400">
                                {stepsInGroup.filter((s) => s.completed).length} / {stepsInGroup.length} steps complete
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Steps List */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            {stepsInGroup.map((step) => {
                              const isStepCurrent = step.id === currentStep?.id;
                              return (
                                <div
                                  key={step.id}
                                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                                    isStepCurrent
                                      ? 'bg-[#99BFF9]/15 border-[#99BFF9] font-bold text-[#1B3D5F] dark:text-slate-100'
                                      : step.completed
                                      ? 'bg-slate-50 dark:bg-slate-800/20 border-slate-200/50 text-slate-400 line-through'
                                      : 'bg-white dark:bg-[#142438] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        completeWorkflowStep(step.id, activeWorkflow.id, false);
                                      }}
                                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                                        step.completed
                                          ? 'bg-[#88C1A8] border-[#88C1A8] text-white'
                                          : 'border-slate-300 dark:border-slate-600 hover:border-[#99BFF9]'
                                      }`}
                                    >
                                      {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                    <span className="truncate">{step.stepTitle}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {isStepCurrent && (
                                      <span className="text-[10px] font-mono font-bold uppercase bg-[#1B3D5F] text-white px-2 py-0.5 rounded">
                                        CURRENT
                                      </span>
                                    )}
                                    {!step.completed && (
                                      <button
                                        onClick={() => startWorkflowFocus(step.id, activeWorkflow.id)}
                                        className="p-1 text-slate-400 hover:text-[#1B3D5F] dark:hover:text-[#99BFF9] cursor-pointer"
                                        title="Start Focus on this step"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Final Guide Publishing Stages */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {allProductStepsComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-[#88C1A8]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                    <span>
                      {allProductStepsComplete
                        ? 'FINAL STAGES (UNLOCKED & ACTIVE)'
                        : 'FINAL STAGES (LOCKED UNTIL ALL REPEAT ITEMS FINISH)'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {finalSteps.map((step) => {
                      const isStepCurrent = step.id === currentStep?.id;
                      const isLocked = !allProductStepsComplete;

                      return (
                        <div
                          key={step.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-colors ${
                            isLocked
                              ? 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-700/40 text-slate-400 opacity-60'
                              : isStepCurrent
                              ? 'bg-gradient-to-r from-[#99BFF9]/20 to-transparent border-2 border-[#99BFF9] font-bold text-[#1B3D5F] dark:text-slate-100'
                              : step.completed
                              ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 text-slate-400 line-through'
                              : 'bg-white dark:bg-[#142438] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                            {isLocked ? (
                              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                              <button
                                onClick={() => completeWorkflowStep(step.id, activeWorkflow.id, false)}
                                className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer shrink-0 ${
                                  step.completed
                                    ? 'bg-[#88C1A8] border-[#88C1A8] text-white'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </button>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold truncate">{step.stepTitle}</div>
                              <div className="text-[11px] font-editorial italic text-slate-400 truncate">
                                {isLocked ? 'Unlocks after all repeat items complete' : 'Final publication sequence'}
                              </div>
                            </div>
                          </div>

                          {!isLocked && !step.completed && (
                            <button
                              onClick={() => startWorkflowFocus(step.id, activeWorkflow.id)}
                              className="px-3 py-1 bg-[#1B3D5F] text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Focus
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State: Create First Project */
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-8 sm:p-12 border border-[#1B3D5F]/10 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] flex items-center justify-center mx-auto">
                <Workflow className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  No Active Projects
                </h3>
                <p className="text-xs sm:text-sm font-editorial italic text-slate-500">
                  Instantiate any workflow template to generate your project pipeline automatically.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-2.5 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-95 shadow-xs cursor-pointer"
              >
                Create Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          CREATE PROJECT MODAL (FROM CHOSEN TEMPLATE)
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 p-6 space-y-5 shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-100">
                CREATE PROJECT FROM WORKFLOW
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {templates.length === 0 ? (
              <div className="text-center py-4 space-y-4">
                <p className="text-slate-500 dark:text-slate-400 font-editorial italic">
                  No workflow templates available. Create a template first to generate new projects.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingTemplate(null);
                    setIsEditingTemplate(true);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] font-bold rounded-xl shadow-xs hover:opacity-95 cursor-pointer"
                >
                  Create Workflow Template
                </button>
              </div>
            ) : currentSelectedTemplate ? (
              <form onSubmit={handleCreateProject} className="space-y-4">
                {/* Template selector */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-500">Workflow Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => {
                      setSelectedTemplateId(e.target.value);
                      const t = templates.find((tpl) => tpl.id === e.target.value) || templates[0];
                      if (t) {
                        setFormName(t.inputs.defaultName);
                        setFormItemCount(t.inputs.defaultItemCount);
                        setFormCollection(t.inputs.defaultCollection);
                      }
                    }}
                    className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.badge ? `(${t.badge})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Project Name Input */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-500">
                    {currentSelectedTemplate.inputs.nameLabel || 'Project / Guide Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={`e.g. ${currentSelectedTemplate.inputs.defaultName}`}
                    className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                {/* Dynamic Number of Items (Repeat Variable) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-500">
                      {currentSelectedTemplate.inputs.itemCountLabel ||
                        `Number of ${currentSelectedTemplate.repeatBlock.itemLabel}s`}
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">Repeats workflow block</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setFormItemCount((c) => Math.max(1, c - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-bold text-sm font-mono text-[#1B3D5F] dark:text-slate-100">
                      {formItemCount} {currentSelectedTemplate.repeatBlock.itemLabel}s
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormItemCount((c) => c + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Dynamic Collection */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-500">
                    {currentSelectedTemplate.inputs.collectionLabel || 'Collection'}
                  </label>
                  <input
                    type="text"
                    value={formCollection}
                    onChange={(e) => setFormCollection(e.target.value)}
                    placeholder={`e.g. ${currentSelectedTemplate.inputs.defaultCollection}`}
                    className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                {/* Steps Calculation Summary */}
                {(() => {
                  const setupStepsCount = currentSelectedTemplate.initialSteps?.length || 0;
                  const repeatStepsCount = currentSelectedTemplate.repeatBlock?.steps?.length || 0;
                  const finalStepsCount = currentSelectedTemplate.finalSteps?.length || 0;
                  const totalSteps = setupStepsCount + formItemCount * repeatStepsCount + finalStepsCount;

                  return (
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] font-bold rounded-xl shadow-xs hover:opacity-95 cursor-pointer text-sm"
                      >
                        Create Project ({totalSteps} Steps)
                      </button>
                      <p className="text-[10px] text-center text-slate-400 font-editorial italic pt-2">
                        {setupStepsCount > 0 ? `${setupStepsCount} setup + ` : ''}
                        {formItemCount} × {repeatStepsCount} repeated + {finalStepsCount} final stages
                      </p>
                    </div>
                  );
                })()}
              </form>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE WORKFLOW CONFIRMATION MODAL (TEMPLATES)
         ======================================================== */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setTemplateToDelete(null)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 p-6 space-y-4 shadow-2xl z-10 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/40">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3D5F] dark:text-slate-100">
                    Delete Workflow?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">"{templateToDelete.name}"</span>?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTemplateToDelete(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Existing projects created from this workflow will not be deleted.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteWorkflowTemplate(templateToDelete.id);
                  setTemplateToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Delete Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT WORKFLOW PROJECT MODAL
         ======================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setEditingProject(null)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 p-6 space-y-5 shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#99BFF9]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-100">
                  EDIT PROJECT
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editProjectName.trim()) return;

                // Check if user is reducing products and removing completed progress
                if (editProjectItemCount < editingProject.itemCount) {
                  const willRemoveCompleted = editingProject.generatedSteps.some(
                    (s: GeneratedWorkflowStep) =>
                      s.stageType === 'repeat' &&
                      s.itemIndex &&
                      s.itemIndex > editProjectItemCount &&
                      (s.completed || s.subtasks.some((st: { completed: boolean }) => st.completed))
                  );
                  if (willRemoveCompleted && !showReduceConfirm) {
                    setShowReduceConfirm(true);
                    return;
                  }
                }

                updateWorkflowProject(editingProject.id, {
                  projectName: editProjectName,
                  itemCount: editProjectItemCount,
                  collection: editProjectCollection,
                });
                setEditingProject(null);
              }}
              className="space-y-4"
            >
              {/* Informational: Source Template */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Workflow Template
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B3D5F] dark:text-slate-200">
                    {templates.find((t) => t.id === editingProject.templateId)?.name || 'Custom / Snapshot Template'}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">Independent instance</span>
                </div>
              </div>

              {/* Project Name */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-600 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  placeholder="e.g. WWII Gifts"
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#99BFF9]"
                />
              </div>

              {/* Number of Products (Repeat Variable) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">
                    Number of Products
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    Currently {editingProject.itemCount} items
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEditProjectItemCount((c) => Math.max(1, c - 1));
                      setShowReduceConfirm(false);
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-bold text-sm font-mono text-[#1B3D5F] dark:text-slate-100">
                    {editProjectItemCount} Products
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProjectItemCount((c) => c + 1);
                      setShowReduceConfirm(false);
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Warning when reducing products with progress */}
              {showReduceConfirm && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-800 dark:text-amber-200 space-y-1.5 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Warning: Progress will be removed</span>
                  </div>
                  <p className="leading-relaxed">
                    Reducing product count from {editingProject.itemCount} to {editProjectItemCount} will remove Products {editProjectItemCount + 1}–{editingProject.itemCount}, which contain completed steps.
                  </p>
                </div>
              )}

              {/* Collection */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-600 dark:text-slate-300">
                  Collection / Category
                </label>
                <input
                  type="text"
                  value={editProjectCollection}
                  onChange={(e) => setEditProjectCollection(e.target.value)}
                  placeholder="e.g. History / WWII"
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#99BFF9]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {showReduceConfirm ? 'Confirm & Save Changes' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE WORKFLOW PROJECT CONFIRMATION MODAL
         ======================================================== */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setProjectToDelete(null)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 p-6 space-y-4 shadow-2xl z-10 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/40">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3D5F] dark:text-slate-100">
                    Delete Project?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">"{projectToDelete.projectName}"</span>?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProjectToDelete(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              This will remove the workflow project and its progress. The workflow template will not be affected.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteWorkflow(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
