export interface WorkflowStepDefinition {
  id: string;
  title: string;
  description?: string;
  defaultSubtasks?: string[];
}

export interface RepeatBlockDefinition {
  id: string;
  title: string; // e.g. "Repeat for each product"
  itemLabel: string; // "Product"
  variableKey: string; // "itemCount"
  steps: WorkflowStepDefinition[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  badge?: string;
  inputs: {
    nameLabel: string;
    itemCountLabel: string;
    collectionLabel: string;
    defaultName: string;
    defaultItemCount: number;
    defaultCollection: string;
  };
  initialSteps: WorkflowStepDefinition[];
  repeatBlock: RepeatBlockDefinition;
  finalSteps: WorkflowStepDefinition[];
}

export interface GeneratedWorkflowStep {
  id: string;
  stageType: 'initial' | 'repeat' | 'final';
  itemIndex?: number; // 1..N (e.g. Product 1, Product 2)
  totalItems?: number; // N (e.g. 10)
  stepIndex: number; // 1..5 in the product loop, or 1..5 in final
  stepTitle: string;
  categoryLabel: string; // "Product 2 of 10" or "Guide Production"
  subtasks: { id: string; title: string; completed: boolean }[];
  completed: boolean;
  completedAt?: string;
}

export interface ProjectWorkflow {
  id: string;
  templateId: string;
  projectName: string; // "WWII Gifts"
  itemCount: number; // 10
  collection: string; // "History / WWII"
  generatedSteps: GeneratedWorkflowStep[];
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface WhatsNextState {
  workflowId: string;
  projectName: string;
  currentStep: GeneratedWorkflowStep;
  completedInItem: string[]; // titles of completed steps in current product
  justFinishedContext?: string; // e.g. "Product 1 complete" or "All 10 products complete"
  nextStepTitle?: string;
  nextStepLabel?: string;
  isComplete: boolean;
  completedStepsCount?: number;
  totalStepsCount?: number;
}
