import React, { useState } from 'react';
import {
  WorkflowTemplate,
  WorkflowStepDefinition,
} from '../types/workflow';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Layers,
  Sparkles,
  Workflow,
  Sliders,
  AlignLeft,
  ListTodo,
} from 'lucide-react';

interface WorkflowEditorProps {
  initialTemplate?: WorkflowTemplate | null;
  onSave: (template: WorkflowTemplate) => void;
  onCancel: () => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  initialTemplate,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialTemplate);

  // Basic Information
  const [name, setName] = useState(initialTemplate?.name || '');
  const [description, setDescription] = useState(initialTemplate?.description || '');
  const [badge, setBadge] = useState(initialTemplate?.badge || '');

  // Inputs Configuration
  const [nameLabel, setNameLabel] = useState(initialTemplate?.inputs.nameLabel || 'Project / Guide Name');
  const [itemCountLabel, setItemCountLabel] = useState(initialTemplate?.inputs.itemCountLabel || 'Number of Products');
  const [collectionLabel, setCollectionLabel] = useState(initialTemplate?.inputs.collectionLabel || 'Collection / Category');
  const [defaultName, setDefaultName] = useState(initialTemplate?.inputs.defaultName || 'New Project');
  const [defaultItemCount, setDefaultItemCount] = useState<number>(initialTemplate?.inputs.defaultItemCount || 10);
  const [defaultCollection, setDefaultCollection] = useState(initialTemplate?.inputs.defaultCollection || 'General');

  // Repeat Block Config
  const [repeatItemLabel, setRepeatItemLabel] = useState(
    initialTemplate?.repeatBlock.itemLabel || 'Product'
  );

  // Step Sections
  const [initialSteps, setInitialSteps] = useState<WorkflowStepDefinition[]>(
    initialTemplate?.initialSteps ? JSON.parse(JSON.stringify(initialTemplate.initialSteps)) : []
  );

  const [repeatSteps, setRepeatSteps] = useState<WorkflowStepDefinition[]>(
    initialTemplate?.repeatBlock.steps
      ? JSON.parse(JSON.stringify(initialTemplate.repeatBlock.steps))
      : [
          { id: 'artwork', title: 'Design Artwork', defaultSubtasks: [] },
          { id: 'product', title: 'Create Product', defaultSubtasks: [] },
          { id: 'mockup', title: 'Create Mockup', defaultSubtasks: [] },
        ]
  );

  const [finalSteps, setFinalSteps] = useState<WorkflowStepDefinition[]>(
    initialTemplate?.finalSteps
      ? JSON.parse(JSON.stringify(initialTemplate.finalSteps))
      : [
          { id: 'review', title: 'Final Review', defaultSubtasks: [] },
          { id: 'publish', title: 'Publish', defaultSubtasks: [] },
        ]
  );

  // Active expanded step for editing details (e.g. "repeat-0" or "final-1")
  const [expandedStepKey, setExpandedStepKey] = useState<string | null>(null);

  // Subtask input state
  const [newSubtaskTexts, setNewSubtaskTexts] = useState<Record<string, string>>({});

  // Helper to reorder steps within section
  const moveStep = (
    section: 'initial' | 'repeat' | 'final',
    index: number,
    direction: 'up' | 'down'
  ) => {
    const list =
      section === 'initial'
        ? [...initialSteps]
        : section === 'repeat'
        ? [...repeatSteps]
        : [...finalSteps];

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    if (section === 'initial') setInitialSteps(list);
    else if (section === 'repeat') setRepeatSteps(list);
    else setFinalSteps(list);
  };

  // Helper to add a step to a section
  const addStep = (section: 'initial' | 'repeat' | 'final') => {
    const newStepId = `step-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const newStep: WorkflowStepDefinition = {
      id: newStepId,
      title: 'New Step',
      description: '',
      defaultSubtasks: [],
    };

    if (section === 'initial') {
      setInitialSteps([...initialSteps, newStep]);
      setExpandedStepKey(`initial-${initialSteps.length}`);
    } else if (section === 'repeat') {
      setRepeatSteps([...repeatSteps, newStep]);
      setExpandedStepKey(`repeat-${repeatSteps.length}`);
    } else {
      setFinalSteps([...finalSteps, newStep]);
      setExpandedStepKey(`final-${finalSteps.length}`);
    }
  };

  // Helper to delete step from section
  const deleteStep = (section: 'initial' | 'repeat' | 'final', index: number) => {
    if (section === 'initial') {
      setInitialSteps(initialSteps.filter((_, i) => i !== index));
    } else if (section === 'repeat') {
      if (repeatSteps.length <= 1) {
        alert('A repeat block must contain at least one step.');
        return;
      }
      setRepeatSteps(repeatSteps.filter((_, i) => i !== index));
    } else {
      setFinalSteps(finalSteps.filter((_, i) => i !== index));
    }
  };

  // Helper to update step properties
  const updateStep = (
    section: 'initial' | 'repeat' | 'final',
    index: number,
    updates: Partial<WorkflowStepDefinition>
  ) => {
    if (section === 'initial') {
      setInitialSteps(
        initialSteps.map((st, i) => (i === index ? { ...st, ...updates } : st))
      );
    } else if (section === 'repeat') {
      setRepeatSteps(
        repeatSteps.map((st, i) => (i === index ? { ...st, ...updates } : st))
      );
    } else {
      setFinalSteps(
        finalSteps.map((st, i) => (i === index ? { ...st, ...updates } : st))
      );
    }
  };

  // Helper to add subtask to a step
  const handleAddSubtask = (section: 'initial' | 'repeat' | 'final', index: number, key: string) => {
    const text = (newSubtaskTexts[key] || '').trim();
    if (!text) return;

    const list =
      section === 'initial'
        ? initialSteps
        : section === 'repeat'
        ? repeatSteps
        : finalSteps;
    const currentSubtasks = list[index].defaultSubtasks || [];

    updateStep(section, index, {
      defaultSubtasks: [...currentSubtasks, text],
    });

    setNewSubtaskTexts((prev) => ({ ...prev, [key]: '' }));
  };

  // Helper to remove subtask from a step
  const handleRemoveSubtask = (
    section: 'initial' | 'repeat' | 'final',
    stepIndex: number,
    subtaskIndex: number
  ) => {
    const list =
      section === 'initial'
        ? initialSteps
        : section === 'repeat'
        ? repeatSteps
        : finalSteps;
    const currentSubtasks = list[stepIndex].defaultSubtasks || [];

    updateStep(section, stepIndex, {
      defaultSubtasks: currentSubtasks.filter((_, i) => i !== subtaskIndex),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name for the workflow template.');
      return;
    }
    if (repeatSteps.length === 0) {
      alert('Please include at least one step in the repeat block.');
      return;
    }

    const templateId =
      initialTemplate?.id ||
      `wf-template-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    const savedTemplate: WorkflowTemplate = {
      id: templateId,
      name: name.trim(),
      description: description.trim() || 'Custom repeatable process template',
      badge: badge.trim() || undefined,
      inputs: {
        nameLabel: nameLabel.trim() || 'Project Name',
        itemCountLabel: itemCountLabel.trim() || `Number of ${repeatItemLabel}s`,
        collectionLabel: collectionLabel.trim() || 'Collection',
        defaultName: defaultName.trim() || name.trim(),
        defaultItemCount: Math.max(1, defaultItemCount),
        defaultCollection: defaultCollection.trim() || 'General',
      },
      initialSteps,
      repeatBlock: {
        id: initialTemplate?.repeatBlock.id || 'repeat-loop',
        title: `Repeat for each ${repeatItemLabel.toLowerCase().trim() || 'product'}`,
        itemLabel: repeatItemLabel.trim() || 'Product',
        variableKey: 'itemCount',
        steps: repeatSteps,
      },
      finalSteps,
    };

    onSave(savedTemplate);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto pb-16">
      {/* Top Header & Actions */}
      <div className="bg-white dark:bg-[#142438] rounded-2xl p-5 sm:p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Cancel and return"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100 font-display">
              {isEditing && initialTemplate ? `Edit: ${initialTemplate.name}` : 'New Workflow Template'}
            </h2>
            <p className="text-xs font-editorial italic text-slate-500">
              Define your process once and reuse it across future projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 shadow-xs active:scale-98 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Save Workflow
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. WORKFLOW BASICS */}
        <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-[#99BFF9]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-[#99BFF9] font-sans">
              WORKFLOW OVERVIEW
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                Workflow Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gift Guide, YouTube Video, Product Launch"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-[#1B3D5F] dark:text-slate-100 text-sm focus:outline-none focus:border-[#99BFF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this workflow accomplishes..."
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#99BFF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Production Loop, Creative, Editorial"
                className="w-full sm:w-1/2 px-3.5 py-2 bg-[#FAF9F6] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#99BFF9]"
              />
            </div>
          </div>
        </div>

        {/* 2. PROJECT INPUTS CONFIGURATION */}
        <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-[#88C1A8]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-[#99BFF9] font-sans">
              INPUTS (VARIABLES ASKED UPON PROJECT CREATION)
            </h3>
          </div>
          <p className="text-xs font-editorial italic text-slate-500">
            When creating a new project from this template, only these variable inputs are requested. Cadence will automatically generate the repeated tasks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Project Name Input */}
            <div className="p-3 bg-[#FAF9F6] dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Input 1 · Text
              </span>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={nameLabel}
                  onChange={(e) => setNameLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Default Value
                </label>
                <input
                  type="text"
                  value={defaultName}
                  onChange={(e) => setDefaultName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Item Count Input */}
            <div className="p-3 bg-[#FAF9F6] dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Input 2 · Number
              </span>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={itemCountLabel}
                  onChange={(e) => setItemCountLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Default Number
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={defaultItemCount}
                  onChange={(e) => setDefaultItemCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Collection Input */}
            <div className="p-3 bg-[#FAF9F6] dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Input 3 · Text
              </span>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={collectionLabel}
                  onChange={(e) => setCollectionLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Default Value
                </label>
                <input
                  type="text"
                  value={defaultCollection}
                  onChange={(e) => setDefaultCollection(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. SECTION: SETUP */}
        <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-slate-100 font-sans">
                SETUP
              </h3>
              <p className="text-[11px] font-editorial italic text-slate-500">
                Optional preparatory tasks executed once before the repeat cycle begins.
              </p>
            </div>
            <button
              type="button"
              onClick={() => addStep('initial')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#1B3D5F] dark:text-[#99BFF9] bg-[#99BFF9]/20 hover:bg-[#99BFF9]/30 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Setup Step</span>
            </button>
          </div>

          {initialSteps.length === 0 ? (
            <div className="py-4 text-center text-xs font-editorial italic text-slate-400 bg-[#FAF9F6] dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              No setup steps. Workflow starts directly with the repeat block.
            </div>
          ) : (
            <div className="space-y-2">
              {initialSteps.map((step, idx) =>
                renderStepRow('initial', step, idx, initialSteps.length)
              )}
            </div>
          )}
        </div>

        {/* 4. SECTION: REPEAT FOR EACH [ITEM] */}
        <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border-2 border-[#99BFF9]/40 dark:border-slate-700 shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-[#99BFF9] font-sans">
                  REPEAT FOR EACH
                </span>
                <input
                  type="text"
                  required
                  value={repeatItemLabel}
                  onChange={(e) => setRepeatItemLabel(e.target.value)}
                  placeholder="e.g. Product, Chapter, Asset"
                  className="px-2.5 py-1 bg-[#FAF9F6] dark:bg-slate-900 border border-[#99BFF9] rounded-lg font-bold text-xs text-[#1B3D5F] dark:text-slate-100 focus:outline-none"
                  title="What is each repeated unit called? (e.g. Product, Chapter, Asset)"
                />
              </div>
              <p className="text-[11px] font-editorial italic text-slate-500">
                These steps will automatically repeat for each {repeatItemLabel || 'item'} (from 1 to N).
              </p>
            </div>

            <button
              type="button"
              onClick={() => addStep('repeat')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 rounded-xl transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-2">
            {repeatSteps.map((step, idx) =>
              renderStepRow('repeat', step, idx, repeatSteps.length)
            )}
          </div>
        </div>

        {/* 5. SECTION: AFTER ALL PRODUCTS (AFTER REPEAT) */}
        <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-slate-100 font-sans">
                AFTER ALL {repeatItemLabel.toUpperCase() || 'PRODUCT'}S (AFTER REPEAT)
              </h3>
              <p className="text-[11px] font-editorial italic text-slate-500">
                Final publication stages executed once all repeated items are completed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => addStep('final')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#1B3D5F] dark:text-[#99BFF9] bg-[#99BFF9]/20 hover:bg-[#99BFF9]/30 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Final Step</span>
            </button>
          </div>

          {finalSteps.length === 0 ? (
            <div className="py-4 text-center text-xs font-editorial italic text-slate-400 bg-[#FAF9F6] dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              No final steps. Workflow completes directly after the last repeated item.
            </div>
          ) : (
            <div className="space-y-2">
              {finalSteps.map((step, idx) =>
                renderStepRow('final', step, idx, finalSteps.length)
              )}
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 shadow-md active:scale-98 rounded-xl transition-all cursor-pointer"
          >
            Save Workflow Template
          </button>
        </div>
      </form>
    </div>
  );

  // Renders each editable step card in a section
  function renderStepRow(
    section: 'initial' | 'repeat' | 'final',
    step: WorkflowStepDefinition,
    idx: number,
    totalCount: number
  ) {
    const key = `${section}-${idx}`;
    const isExpanded = expandedStepKey === key;
    const subtasks = step.defaultSubtasks || [];

    return (
      <div
        key={step.id || key}
        className={`rounded-xl border transition-all ${
          isExpanded
            ? 'bg-[#FAF9F6] dark:bg-slate-900 border-[#99BFF9] dark:border-slate-700 shadow-xs'
            : 'bg-white dark:bg-[#142438] border-slate-200 dark:border-slate-800 hover:border-slate-300'
        }`}
      >
        {/* Step Header Row */}
        <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
          <div
            onClick={() => setExpandedStepKey(isExpanded ? null : key)}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none"
          >
            <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-slate-500 shrink-0">
              {idx + 1}
            </span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#1B3D5F] dark:text-slate-100 block truncate">
                {step.title || 'Untitled Step'}
              </span>
              {step.description && !isExpanded && (
                <span className="text-[11px] font-editorial italic text-slate-400 block truncate">
                  {step.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {subtasks.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 mr-1">
                {subtasks.length} subtasks
              </span>
            )}

            {/* Reorder Up */}
            <button
              type="button"
              disabled={idx === 0}
              onClick={() => moveStep(section, idx, 'up')}
              className={`p-1 rounded-lg border transition-colors ${
                idx === 0
                  ? 'opacity-30 border-transparent text-slate-300 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer'
              }`}
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            {/* Reorder Down */}
            <button
              type="button"
              disabled={idx === totalCount - 1}
              onClick={() => moveStep(section, idx, 'down')}
              className={`p-1 rounded-lg border transition-colors ${
                idx === totalCount - 1
                  ? 'opacity-30 border-transparent text-slate-300 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer'
              }`}
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Edit / Expand */}
            <button
              type="button"
              onClick={() => setExpandedStepKey(isExpanded ? null : key)}
              className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-[#1B3D5F] dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              {isExpanded ? 'Done' : 'Edit'}
            </button>

            {/* Delete Step */}
            <button
              type="button"
              onClick={() => deleteStep(section, idx)}
              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer transition-colors"
              title="Delete step"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded Step Detail Form */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Step Title
              </label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStep(section, idx, { title: e.target.value })}
                placeholder="e.g. Create Product Photos"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-[#1B3D5F] dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Step Description / Guidance
              </label>
              <input
                type="text"
                value={step.description || ''}
                onChange={(e) => updateStep(section, idx, { description: e.target.value })}
                placeholder="e.g. Generate high-resolution angles, mockup render, and crop"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              />
            </div>

            {/* Subtasks Section */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Subtasks / Checklist
              </label>

              {subtasks.length > 0 && (
                <div className="space-y-1.5">
                  {subtasks.map((stText, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#99BFF9]" />
                        <span className="text-slate-700 dark:text-slate-200">{stText}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(section, idx, sIdx)}
                        className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                        title="Remove subtask"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Subtask Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSubtaskTexts[key] || ''}
                  onChange={(e) =>
                    setNewSubtaskTexts((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask(section, idx, key);
                    }
                  }}
                  placeholder="Add a checklist item (press Enter)..."
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubtask(section, idx, key)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};
