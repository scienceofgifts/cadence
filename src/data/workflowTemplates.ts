import { WorkflowTemplate, ProjectWorkflow, GeneratedWorkflowStep } from '../types/workflow';

export const GIFT_GUIDE_TEMPLATE: WorkflowTemplate = {
  id: 'gift-guide',
  name: 'Gift Guide',
  description: 'Repeatable product creation loop followed by final guide writing and publishing.',
  badge: 'Production Loop',
  inputs: {
    nameLabel: 'Guide Name',
    itemCountLabel: 'Number of Products',
    collectionLabel: 'Collection',
    defaultName: 'WWII Gifts',
    defaultItemCount: 10,
    defaultCollection: 'History / WWII',
  },
  initialSteps: [],
  repeatBlock: {
    id: 'product-loop',
    title: 'Repeat for each product',
    itemLabel: 'Product',
    variableKey: 'itemCount',
    steps: [
      {
        id: 'artwork',
        title: 'Design Artwork',
        description: 'Create and refine the primary visual artwork for the product.',
        defaultSubtasks: ['Sketch visual concept', 'Draft vector artwork', 'Export master file'],
      },
      {
        id: 'product',
        title: 'Create Product',
        description: 'Set up product specifications, dimensions, and manufacturing files.',
        defaultSubtasks: ['Configure product specs', 'Upload print file', 'Review bleed area'],
      },
      {
        id: 'mockup',
        title: 'Create Mockup',
        description: 'Generate photorealistic mockups of the finished physical item.',
        defaultSubtasks: ['Place on product template', 'Adjust lighting & shadows', 'Export mockup render'],
      },
      {
        id: 'photos',
        title: 'Create Product Photos',
        description: 'Produce atmospheric photography and lifestyle images for the guide.',
        defaultSubtasks: ['Generate scene angles', 'Check composition', 'Export final photo set'],
      },
      {
        id: 'copy',
        title: 'Write Product Copy',
        description: 'Write engaging editorial descriptions, specs, and purchase notes.',
        defaultSubtasks: ['Draft headline', 'Write product story', 'Format specifications'],
      },
    ],
  },
  finalSteps: [
    {
      id: 'write-guide',
      title: 'Write Gift Guide',
      description: 'Synthesize all products into a compelling editorial guide narrative.',
      defaultSubtasks: ['Write introductory hook', 'Organize product sections', 'Draft concluding tips'],
    },
    {
      id: 'edit-guide',
      title: 'Edit',
      description: 'Review tone, voice, accuracy, and flow across the full guide.',
      defaultSubtasks: ['Tone and voice check', 'Proofread all copy', 'Verify product names'],
    },
    {
      id: 'internal-links',
      title: 'Add Internal Links',
      description: 'Add contextual links to shop pages, related articles, and collections.',
      defaultSubtasks: ['Link product catalog items', 'Add related reading', 'Test all links'],
    },
    {
      id: 'final-review',
      title: 'Final Review',
      description: 'Comprehensive mobile and desktop check before launching live.',
      defaultSubtasks: ['Check mobile rendering', 'Review photography sizing', 'Final checklist sign-off'],
    },
    {
      id: 'publish',
      title: 'Publish',
      description: 'Deploy the guide to production and activate promotional channels.',
      defaultSubtasks: ['Publish live URL', 'Verify social share cards', 'Schedule newsletter mention'],
    },
  ],
};

export const INITIAL_TEMPLATES: WorkflowTemplate[] = [
  GIFT_GUIDE_TEMPLATE,
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  GIFT_GUIDE_TEMPLATE,
];

/**
 * Generates all executable steps from a template and user inputs.
 */
export function generateProjectWorkflow(
  template: WorkflowTemplate,
  projectName: string,
  itemCount: number,
  collection: string
): ProjectWorkflow {
  const steps: GeneratedWorkflowStep[] = [];
  const safeCount = Math.max(1, itemCount);
  const itemLabel = template.repeatBlock?.itemLabel?.trim() || 'Product';

  // 1. Initial steps (Setup)
  (template.initialSteps || []).forEach((st, idx) => {
    steps.push({
      id: `step-init-${st.id || idx}`,
      stageType: 'initial',
      stepIndex: idx + 1,
      stepTitle: st.title,
      categoryLabel: 'Setup',
      subtasks: (st.defaultSubtasks || []).map((t, sIdx) => ({
        id: `st-init-${idx}-${sIdx}`,
        title: t,
        completed: false,
      })),
      completed: false,
    });
  });

  // 2. Repeat block loop (Product 1 to Product N)
  const repeatSteps = template.repeatBlock?.steps || [];
  for (let i = 1; i <= safeCount; i++) {
    repeatSteps.forEach((st, stepIdx) => {
      steps.push({
        id: `step-prod-${i}-${st.id || stepIdx}`,
        stageType: 'repeat',
        itemIndex: i,
        totalItems: safeCount,
        stepIndex: stepIdx + 1,
        stepTitle: st.title,
        categoryLabel: `${itemLabel} ${i} of ${safeCount}`,
        subtasks: (st.defaultSubtasks || []).map((t, sIdx) => ({
          id: `st-${i}-${stepIdx}-${sIdx}`,
          title: t,
          completed: false,
        })),
        completed: false,
      });
    });
  }

  // 3. Final steps (After all products)
  const finalCategory = template.id === 'gift-guide' ? 'Guide Production' : `${template.name} Final Stages`;
  (template.finalSteps || []).forEach((st, idx) => {
    steps.push({
      id: `step-final-${st.id || idx}`,
      stageType: 'final',
      stepIndex: idx + 1,
      stepTitle: st.title,
      categoryLabel: finalCategory,
      subtasks: (st.defaultSubtasks || []).map((t, sIdx) => ({
        id: `st-final-${idx}-${sIdx}`,
        title: t,
        completed: false,
      })),
      completed: false,
    });
  });

  return {
    id: `wf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    templateId: template.id,
    projectName: projectName.trim() || template.inputs.defaultName,
    itemCount: safeCount,
    collection: collection.trim() || template.inputs.defaultCollection,
    generatedSteps: steps,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Creates the initial WWII Gifts demo workflow project.
 */
export function createInitialWWIIGiftGuideWorkflow(): ProjectWorkflow {
  return generateProjectWorkflow(
    GIFT_GUIDE_TEMPLATE,
    'WWII Gifts',
    10,
    'History / WWII'
  );
}
