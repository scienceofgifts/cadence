import React, { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Timer,
  Check,
  Compass,
  FileText,
  Sliders,
  Eye,
  Info,
} from 'lucide-react';
import { useTask } from '../context/TaskContext';

export const WorkflowConceptStoryboard: React.FC = () => {
  const { setActiveView } = useTask();

  // Active panel tab: 'all' for panoramic storyboard, or 1..8 for focused interactive mode
  const [activeStage, setActiveStage] = useState<number | 'all'>('all');
  const [interactiveStep, setInteractiveStep] = useState<number>(1);
  const [productCount, setProductCount] = useState<number>(10);

  // Focus timer simulation in panel 5
  const [focusRunning, setFocusRunning] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Blueprint Header */}
      <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 sm:p-8 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9]">
                <Workflow className="w-3.5 h-3.5" />
                Architecture Blueprint
              </span>
              <span className="text-xs font-mono text-slate-400">8-Stage Interactive Guide</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 font-display">
              The "What's Next" Guided Workflow
            </h1>
            <p className="text-sm sm:text-base font-editorial italic text-slate-600 dark:text-slate-300 leading-relaxed">
              "I don't want another to-do list. I want the app to know the process I've already defined and guide me through it one step at a time."
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveStage('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeStage === 'all'
                  ? 'bg-white dark:bg-[#142438] text-[#1B3D5F] dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Panoramic Storyboard (All 8)
            </button>
            <button
              onClick={() => {
                setActiveStage(1);
                setInteractiveStep(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                typeof activeStage === 'number'
                  ? 'bg-white dark:bg-[#142438] text-[#1B3D5F] dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Step-by-Step Simulation
            </button>
          </div>
        </div>

        {/* Quick Stage Jump Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none text-xs">
          {[
            { num: 1, title: 'Template' },
            { num: 2, title: 'Create' },
            { num: 3, title: 'Generated' },
            { num: 4, title: "What's Next" },
            { num: 5, title: 'Guided Focus' },
            { num: 6, title: 'Complete Step' },
            { num: 7, title: 'Auto-Advance' },
            { num: 8, title: 'Final Stage' },
          ].map((item) => (
            <button
              key={item.num}
              onClick={() => {
                setActiveStage(item.num);
                setInteractiveStep(item.num);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStage === item.num
                  ? 'bg-[#1B3D5F] text-white dark:bg-[#99BFF9] dark:text-[#1B3D5F] font-semibold'
                  : 'bg-slate-100/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60'
              }`}
            >
              <span className="font-mono text-[10px] opacity-75">0{item.num}</span>
              <span>{item.title}</span>
            </button>
          ))}
          {activeStage !== 'all' && (
            <button
              onClick={() => setActiveStage('all')}
              className="ml-auto text-xs text-[#1B3D5F] dark:text-[#99BFF9] font-medium hover:underline cursor-pointer"
            >
              View All 8 Panels
            </button>
          )}
        </div>
      </div>

      {/* PANELS CONTAINER */}
      <div className="space-y-12">
        {/* PANEL 1: WORKFLOW TEMPLATE */}
        {(activeStage === 'all' || activeStage === 1) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 1 of 8
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  Workflow Template Builder
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  The user defines the recipe once. "Repeat for each product" is a clear visual block—never complicated programming.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Setup Stage
              </span>
            </div>

            {/* UI Card for Panel 1 */}
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-6">
              {/* Template Title */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-100">
                      GIFT GUIDE WORKFLOW
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">Template ID: tpl-gift-guide-v1</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C3F3DF]/30 text-[#1B3D5F] dark:text-slate-200 font-semibold">
                  Reusable Pattern
                </span>
              </div>

              {/* Flow Steps */}
              <div className="space-y-4 max-w-xl mx-auto">
                {/* Start node */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center text-xs font-bold font-mono">
                    S
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">START</span>
                </div>

                {/* Step 1: Define products */}
                <div className="ml-3 pl-6 border-l-2 border-slate-200 dark:border-slate-800 py-1">
                  <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="w-5 h-5 rounded-full bg-[#1B3D5F]/10 dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-200 flex items-center justify-center text-[10px] font-bold font-mono">
                      1
                    </span>
                    <span className="text-xs font-semibold text-[#1B3D5F] dark:text-slate-100">
                      Define products & list
                    </span>
                  </div>
                </div>

                {/* REPEAT BLOCK: Repeat for each product */}
                <div className="ml-3 pl-6 border-l-2 border-[#99BFF9] py-1">
                  <div className="p-4 bg-gradient-to-br from-[#99BFF9]/10 to-[#C3F3DF]/10 dark:from-slate-800/90 dark:to-slate-800/50 rounded-2xl border-2 border-dashed border-[#99BFF9]/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#28537D] dark:text-[#99BFF9]" />
                        <span className="text-xs font-bold tracking-wider text-[#1B3D5F] dark:text-slate-100 uppercase">
                          Repeat for each product
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                        LOOP CONTAINER (N Products)
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-2">
                      {[
                        'Design artwork',
                        'Create product',
                        'Create mockup',
                        'Create product photos',
                        'Write product copy',
                      ].map((step, idx) => (
                        <div
                          key={step}
                          className="flex items-center gap-2.5 p-2 bg-white/90 dark:bg-[#142438]/90 rounded-lg border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] flex items-center justify-center text-[10px] font-mono font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AFTER ALL PRODUCTS: Guide Level Steps */}
                <div className="ml-3 pl-6 border-l-2 border-slate-200 dark:border-slate-800 py-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>After all products completed:</span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { num: 6, label: 'Write gift guide' },
                      { num: 7, label: 'Edit' },
                      { num: 8, label: 'Add internal links' },
                      { num: 9, label: 'Final review' },
                      { num: 10, label: 'Publish' },
                    ].map((step) => (
                      <div
                        key={step.num}
                        className="flex items-center gap-2.5 p-2.5 bg-[#FAF9F6] dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium"
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                          {step.num}
                        </span>
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Supported Workflow Badges */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Also works for:</span>
                {['YouTube Video', 'Product Launch', 'Poster Collection', 'Substack Article', 'Print Catalog'].map(
                  (badge) => (
                    <span
                      key={badge}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px]"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* PANEL 2: CREATE PROJECT FROM WORKFLOW */}
        {(activeStage === 'all' || activeStage === 2) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 2 of 8
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  Create Project from Workflow
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  User inputs only the variable details. The engine calculates the entire sequence without manual checklist duplication.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Instantiation
              </span>
            </div>

            {/* UI Card for Panel 2 */}
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 sm:p-8 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs max-w-xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-100">
                  CREATE PROJECT
                </h3>
                <span className="text-xs text-slate-400 font-editorial italic">From Gift Guide Template</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Workflow field */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-500 dark:text-slate-400">Workflow Template</label>
                  <div className="p-2.5 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-[#1B3D5F] dark:text-slate-100 flex items-center justify-between">
                    <span>Gift Guide (Loop + Publishing)</span>
                    <span className="text-[10px] font-mono text-[#99BFF9]">5 repeated steps + 5 final</span>
                  </div>
                </div>

                {/* Guide name field */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-500 dark:text-slate-400">Guide Name</label>
                  <input
                    type="text"
                    readOnly
                    value="WWII Gifts"
                    className="w-full p-2.5 bg-white dark:bg-[#142438] rounded-xl border-2 border-[#99BFF9] font-bold text-sm text-[#1B3D5F] dark:text-slate-100 focus:outline-none"
                  />
                </div>

                {/* Number of products variable */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-500 dark:text-slate-400">Number of Products</label>
                    <span className="text-[11px] font-mono text-slate-400">Loop Multiplier</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setProductCount((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-bold text-base font-mono text-[#1B3D5F] dark:text-slate-100">
                      [ {productCount} ]
                    </span>
                    <button
                      onClick={() => setProductCount((p) => p + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Collection field */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-500 dark:text-slate-400">Collection / Category</label>
                  <div className="p-2.5 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>History / WWII</span>
                    <span className="w-2 h-2 rounded-full bg-[#88C1A8]" />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveStage(3);
                      setInteractiveStep(3);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] font-bold rounded-xl shadow-xs hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Create Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400 font-editorial italic pt-2">
                    Auto-creates 50 ordered product micro-steps + 5 locked publishing stages with 1 click.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PANEL 3: GENERATED PROJECT */}
        {(activeStage === 'all' || activeStage === 3) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 3 of 8
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  Generated Project Roadmap
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  The generated state. The workflow tracks active progress; future stages are locked until reached.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                System State
              </span>
            </div>

            {/* UI Card for Panel 3 */}
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-6">
              {/* Project Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#88C1A8]" />
                    <h3 className="text-base font-bold text-[#1B3D5F] dark:text-slate-100">
                      WWII GIFT GUIDE
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-slate-400">10 PRODUCTS IN PIPELINE</p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] font-bold">
                    Product 02 Active
                  </span>
                </div>
              </div>

              {/* Loop list display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Product 01 (Completed) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>PRODUCT 01</span>
                    <span className="text-[#88C1A8] text-[10px] font-mono">COMPLETE</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Artwork</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Product</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Mockup</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Product photos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Copy</span>
                    </div>
                  </div>
                </div>

                {/* Product 02 (Current active) */}
                <div className="p-4 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border-2 border-[#99BFF9] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1B3D5F] dark:text-slate-100">
                    <span>PRODUCT 02</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#99BFF9]/30 text-[#1B3D5F] dark:text-[#99BFF9] rounded">
                      CURRENT
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 line-through">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Artwork</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 line-through">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Product</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 line-through">
                      <Check className="w-3.5 h-3.5 text-[#88C1A8]" /> <span>Mockup</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#1B3D5F] dark:text-[#99BFF9] bg-[#99BFF9]/15 p-1 rounded">
                      <ArrowRight className="w-3.5 h-3.5" /> <span>Product photos</span>
                      <span className="ml-auto text-[9px] font-mono uppercase bg-[#1B3D5F] text-white px-1 rounded">
                        NOW
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 pl-5">
                      <span>Copy</span>
                    </div>
                  </div>
                </div>

                {/* Product 03 (Upcoming) */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/40 space-y-2 opacity-70">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>PRODUCT 03</span>
                    <span className="text-[10px] font-mono">QUEUED</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">○ <span>Artwork</span></div>
                    <div className="flex items-center gap-1.5">○ <span>Product</span></div>
                    <div className="flex items-center gap-1.5">○ <span>Mockup</span></div>
                    <div className="flex items-center gap-1.5">○ <span>Product photos</span></div>
                    <div className="flex items-center gap-1.5">○ <span>Copy</span></div>
                  </div>
                </div>
              </div>

              {/* Collapsed indication for Products 04 through 10 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                <span>... Products 04 through 09 queued in background ...</span>
                <span className="font-mono text-[11px]">Product 10 (Last Loop)</span>
              </div>

              {/* Locked Final Publishing Stages */}
              <div className="p-4 bg-[#FAF9F6] dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>GIFT GUIDE FINAL STAGES (LOCKED UNTIL ALL PRODUCTS FINISH)</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Write Guide</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Edit</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Internal Links</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Final Review</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Publish</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PANEL 4: "WHAT'S NEXT?" - THE CORE FEATURE */}
        {(activeStage === 'all' || activeStage === 4) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 4 of 8 · Primary Focus
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  "What's Next" Dashboard Experience
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  The heart of the system. Instead of scanning 50 to-do items, the app presents ONE clear, immediate next action.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Daily Workspace
              </span>
            </div>

            {/* UI Card for Panel 4: The What's Next Card */}
            <div className="bg-gradient-to-br from-white via-white to-[#FAF9F6] dark:from-[#142438] dark:to-[#0C1724] rounded-2xl p-6 sm:p-8 border-2 border-[#1B3D5F]/15 dark:border-slate-700 shadow-md space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#99BFF9] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-[#99BFF9]">
                    WHAT'S NEXT
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-semibold">WWII Gift Guide</span>
              </div>

              {/* Main Content Area */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Product 2 of 10
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100">
                    CREATE PRODUCT PHOTOS
                  </h3>
                </div>

                {/* Context Recap */}
                <div className="p-4 bg-[#FAF9F6] dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    You've completed:
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1 text-[#88C1A8] font-bold">
                      <Check className="w-4 h-4 stroke-[3]" /> Artwork
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-[#88C1A8] font-bold">
                      <Check className="w-4 h-4 stroke-[3]" /> Product
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-[#88C1A8] font-bold">
                      <Check className="w-4 h-4 stroke-[3]" /> Mockup
                    </span>
                  </div>
                  <p className="text-xs font-editorial italic text-slate-600 dark:text-slate-300 pt-1">
                    Your next step is to create the product photography.
                  </p>
                </div>

                {/* Primary CTA */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveStage(5);
                      setInteractiveStep(5);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] font-bold rounded-xl shadow-xs hover:opacity-95 cursor-pointer flex items-center gap-2 text-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start</span>
                  </button>

                  <span className="text-xs font-editorial italic text-slate-400">
                    Launches guided Pomodoro timer directly for this step.
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PANEL 5: GUIDED FOCUS MODE */}
        {(activeStage === 'all' || activeStage === 5) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 5 of 8
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  Guided Focus Mode
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  The existing Pomodoro timer extended with workflow context. The timer is familiar; the task is pre-selected.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Focus Session
              </span>
            </div>

            {/* UI Card for Panel 5 */}
            <div className="bg-[#142438] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl max-w-lg mx-auto space-y-6 text-center">
              {/* Workflow Breadcrumb */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#99BFF9] font-bold">
                  WWII GIFT GUIDE · PRODUCT 2 OF 10
                </span>
                <h3 className="text-xl font-bold tracking-tight text-slate-100">
                  CREATE PRODUCT PHOTOS
                </h3>
              </div>

              {/* Pomodoro Clock */}
              <div className="py-4">
                <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-white">
                  25:00
                </div>
                <span className="text-xs font-mono text-slate-400">Standard Focus Interval</span>
              </div>

              {/* Sub-steps Checklist */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 text-left space-y-2 max-w-xs mx-auto">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded border border-slate-500 flex items-center justify-center text-[10px]">○</span>
                  <span>Generate image</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded border border-slate-500 flex items-center justify-center text-[10px]">○</span>
                  <span>Check composition</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded border border-slate-500 flex items-center justify-center text-[10px]">○</span>
                  <span>Export final image</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActiveStage(6);
                    setInteractiveStep(6);
                  }}
                  className="w-full py-3 bg-[#99BFF9] text-[#1B3D5F] font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-sm"
                >
                  Complete Step & Finish Focus
                </button>

                {/* Subsequent Step Hint */}
                <div className="text-xs font-mono text-slate-400">
                  After this step: <span className="text-[#C3F3DF]">→ Write product copy</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PANEL 6: COMPLETING A STEP */}
        {(activeStage === 'all' || activeStage === 6) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 6 of 8
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  Completing a Step
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  Clear confirmation with immediate forward trajectory. No checklist hunting.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Handoff State
              </span>
            </div>

            {/* UI Card for Panel 6 */}
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 sm:p-8 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs max-w-md mx-auto text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-[#C3F3DF]/40 text-[#1B3D5F] dark:text-[#88C1A8] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1B3D5F] dark:text-slate-100">
                  ✓ PRODUCT PHOTOS COMPLETE
                </h3>
                <p className="text-xs font-mono text-slate-400">Product 2 of 10</p>
              </div>

              <div className="p-4 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-left space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Next step:</span>
                <div className="text-sm font-bold text-[#1B3D5F] dark:text-[#99BFF9]">
                  WRITE PRODUCT COPY
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveStage(7);
                  setInteractiveStep(7);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] font-bold rounded-xl cursor-pointer text-sm"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {/* PANEL 7: AUTOMATIC ADVANCEMENT */}
        {(activeStage === 'all' || activeStage === 7) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 7 of 8
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  Automatic Advancement Loop
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  The user never needs to manually figure out which repeated item comes next. Loops advance smoothly.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Continuous Flow
              </span>
            </div>

            {/* UI Card for Panel 7 */}
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs uppercase text-[#1B3D5F] dark:text-slate-100">
                  WWII GIFT GUIDE
                </span>
                <span className="text-xs font-mono text-[#99BFF9] font-bold">STATE: ADVANCED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current State */}
                <div className="p-4 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border-2 border-[#99BFF9] space-y-2">
                  <span className="text-xs font-bold text-[#1B3D5F] dark:text-slate-100 font-mono">
                    PRODUCT 2 OF 10 (NOW ADVANCED)
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400 line-through">✓ Artwork</div>
                    <div className="text-slate-400 line-through">✓ Product</div>
                    <div className="text-slate-400 line-through">✓ Mockup</div>
                    <div className="text-slate-400 line-through">✓ Product photos</div>
                    <div className="font-bold text-[#1B3D5F] dark:text-[#99BFF9] flex items-center gap-1.5 bg-[#99BFF9]/20 p-1 rounded">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Product copy (ACTIVE)</span>
                    </div>
                  </div>
                </div>

                {/* Next Loop Transition */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    THEN AUTOMATICALLY:
                  </span>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      PRODUCT 3 OF 10
                    </div>
                    <div className="text-[#1B3D5F] dark:text-[#99BFF9] flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Artwork (Restarts Loop)</span>
                    </div>
                    <p className="text-[11px] font-editorial italic text-slate-400 pt-2">
                      When Product 2 Copy finishes, Product 3 starts automatically at step 1.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setActiveStage(8);
                    setInteractiveStep(8);
                  }}
                  className="px-5 py-2 bg-[#1B3D5F] text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Fast-Forward to Final Workflow Stage (10/10 Complete) →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* PANEL 8: FINAL WORKFLOW STAGE */}
        {(activeStage === 'all' || activeStage === 8) && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4 px-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#99BFF9] uppercase tracking-wider">
                  Panel 8 of 8
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                  Final Workflow Stage
                </h2>
                <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
                  After all 10 products complete, the workflow switches from product loops to the final guide publication steps.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Closing Phase
              </span>
            </div>

            {/* UI Card for Panel 8 */}
            <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 sm:p-8 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs space-y-6">
              {/* Product Loop Completed Banner */}
              <div className="p-4 bg-[#C3F3DF]/30 dark:bg-[#1B3D5F]/30 rounded-xl border border-[#88C1A8]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#88C1A8]" />
                  <span className="text-sm font-bold text-[#1B3D5F] dark:text-slate-100">
                    ✓ 10 / 10 PRODUCTS COMPLETE
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">50 micro-tasks finished</span>
              </div>

              {/* Unlocked Final Publishing Pipeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  NEXT: GUIDE PRODUCTION & PUBLISHING
                </span>

                <div className="space-y-2">
                  <div className="p-4 bg-gradient-to-r from-[#99BFF9]/20 to-transparent dark:bg-slate-800 rounded-xl border-2 border-[#99BFF9] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1B3D5F] text-white flex items-center justify-center text-xs font-bold font-mono">
                        6
                      </span>
                      <div>
                        <div className="text-sm font-bold text-[#1B3D5F] dark:text-slate-100">
                          WRITE GIFT GUIDE
                        </div>
                        <div className="text-xs font-editorial italic text-slate-500">
                          Synthesize all 10 products into cohesive editorial narrative.
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1B3D5F] text-white">
                      ACTIVE NOW
                    </span>
                  </div>

                  {[
                    { num: 7, title: 'Edit' },
                    { num: 8, title: 'Add internal links' },
                    { num: 9, title: 'Final review' },
                    { num: 10, title: 'Publish' },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="p-3 bg-[#FAF9F6] dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center text-[10px] font-mono">
                        {step.num}
                      </span>
                      <span className="font-medium">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Summary Architectural Footer */}
      <div className="bg-[#FAF9F6] dark:bg-[#0C1724] p-6 rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-200 font-sans">
          Key Takeaways of the Guided Workflow Architecture
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="space-y-1">
            <span className="font-bold text-[#1B3D5F] dark:text-[#99BFF9]">1. Zero Checklist Overhead</span>
            <p className="font-editorial italic">
              User enters 1 multiplier (e.g. 10 products) instead of typing 55 individual tasks.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-[#1B3D5F] dark:text-[#99BFF9]">2. Singular Attention</span>
            <p className="font-editorial italic">
              "What's Next" eliminates decision fatigue by answering "what should I do next?" immediately.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-[#1B3D5F] dark:text-[#99BFF9]">3. Integrated Focus Timer</span>
            <p className="font-editorial italic">
              Connects seamlessly into the existing Pomodoro timer without redesigning it.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">Cadence Product Engineering Blueprint</span>
          <button
            onClick={() => setActiveView('today')}
            className="text-xs font-bold text-[#1B3D5F] dark:text-[#99BFF9] hover:underline cursor-pointer"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
