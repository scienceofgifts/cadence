import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { AreaId, Project } from '../types';
import { Plus, Layers, Calendar, CheckCircle2, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { formatNiceDate } from '../utils/date';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    tasks,
    categories,
    addProject,
    deleteProject,
    openTaskDetail,
    openProjectDetail,
    activeDetailProjectId,
    closeProjectDetail,
    addTask,
  } = useTask();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [areaId, setAreaId] = useState<AreaId>('website-shop');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const [filterArea, setFilterArea] = useState<AreaId | 'all'>('all');

  const filteredProjects = projects.filter((p) =>
    filterArea === 'all' ? true : p.areaId === filterArea
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      areaId,
      description: description.trim(),
      deadline: deadline || undefined,
    });

    setName('');
    setDescription('');
    setDeadline('');
    setIsAddOpen(false);
  };

  const selectedProject = projects.find((p) => p.id === activeDetailProjectId);
  const selectedProjectTasks = selectedProject
    ? tasks.filter((t) => t.projectId === selectedProject.id)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#142438] p-5 rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100">
            Life Projects & Initiatives
          </h2>
          <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
            Purposeful destinations across Website, YouTube, House, Reading, and Workout.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-90 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((proj) => {
          const category = categories.find((c) => c.id === proj.areaId);
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedTasks = projTasks.filter((t) => t.completed);
          const percent = projTasks.length > 0 ? Math.round((completedTasks.length / projTasks.length) * 100) : 0;

          return (
            <div
              key={proj.id}
              onClick={() => openProjectDetail(proj.id)}
              className="group relative flex flex-col justify-between p-5 bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 hover:border-[#99BFF9] dark:hover:border-[#99BFF9] shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <div className="space-y-3">
                
                {/* Category tag */}
                <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category?.accentColor || '#99BFF9' }}
                    />
                    {category?.shortName}
                  </span>

                  {proj.deadline && (
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Calendar className="w-3 h-3" />
                      {formatNiceDate(proj.deadline)}
                    </span>
                  )}
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-base font-bold text-[#1B3D5F] dark:text-slate-100 group-hover:text-[#28537D] dark:group-hover:text-[#99BFF9] transition-colors">
                    {proj.name}
                  </h3>
                  {proj.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>

              </div>

              {/* Progress & Task counts */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">
                    {completedTasks.length} / {projTasks.length} tasks
                  </span>
                  <span className="font-bold text-[#1B3D5F] dark:text-slate-200">
                    {percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3D5F]/30 dark:bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#1B3D5F] dark:text-slate-100">
              Create New Life Project
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Science of Gifts Summer Guide"
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#99BFF9]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Area</label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value as AreaId)}
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description / Goal</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does done look like?"
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-5 py-2 font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-90 shadow-xs cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Project Detail Drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#1B3D5F]/30 dark:bg-slate-950/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={closeProjectDetail} />

          <div className="relative w-full max-w-lg h-full bg-white dark:bg-[#142438] border-l border-[#1B3D5F]/15 dark:border-slate-800 shadow-2xl flex flex-col z-10 p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Layers className="w-4 h-4 text-[#99BFF9]" />
                <span>Project Workspace</span>
              </div>
              <button
                onClick={closeProjectDetail}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1B3D5F] dark:text-slate-100">
                {selectedProject.name}
              </h2>
              {selectedProject.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {selectedProject.description}
                </p>
              )}
            </div>

            {/* Project Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#1B3D5F] dark:text-slate-200">
                  Tasks in Project ({selectedProjectTasks.length})
                </h4>
                <button
                  onClick={() => {
                    const title = window.prompt("Task title for " + selectedProject.name + ":");
                    if (!title) return;
                    addTask({
                      title,
                      projectId: selectedProject.id,
                      areaId: selectedProject.areaId,
                      priority: 'none',
                      dueDate: new Date().toISOString().split('T')[0],
                      recurring: 'none',
                      notes: '',
                      subtasks: [],
                      links: [],
                      completed: false,
                    });
                  }}
                  className="text-xs font-semibold text-[#28537D] dark:text-[#99BFF9] hover:underline cursor-pointer"
                >
                  + Add task
                </button>
              </div>

              <div className="space-y-2">
                {selectedProjectTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => openTaskDetail(t.id)}
                    className="p-3 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#99BFF9] cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className={`font-semibold ${t.completed ? 'line-through text-slate-400' : 'text-[#1B3D5F] dark:text-slate-100'}`}>
                      {t.title}
                    </span>
                    {t.completed && <CheckCircle2 className="w-4 h-4 text-[#88C1A8]" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => {
                  if (window.confirm("Delete this project?")) {
                    deleteProject(selectedProject.id);
                    closeProjectDetail();
                  }
                }}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete project
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
