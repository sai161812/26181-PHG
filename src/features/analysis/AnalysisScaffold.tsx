import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { BrainCircuit } from 'lucide-react';

export const AnalysisScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="AI Analysis & Inference Pipeline"
      subtitle="5-stage explainable reasoning workflow and transparent rule factor decomposition"
      phaseTarget="Phase 3"
      plannedTabs={['Current evaluation', 'Inference pipeline', 'Category scores']}
      plannedFeatures={[
        'Five sequential stages: Sensor Data → Personal Baseline → Environment → Pattern Analysis → Risk Assessment',
        'Factor contribution table with observed value, reference threshold, and mathematical weight',
        'Five physiological anomaly categories: Cardiovascular, Respiratory, Heat Stress, Fatigue, and Fall/Motion',
        'Truthful disclosure: Confidence not estimated by this demonstration engine',
        'Architecture contract note for future Qualcomm Snapdragon NPU on-device inference migration'
      ]}
      icon={<BrainCircuit size={24} />}
    />
  );
};
