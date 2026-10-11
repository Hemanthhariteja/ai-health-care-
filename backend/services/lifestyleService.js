const dietGuidance = [
  {
    id: 'diet-1',
    title: 'Balanced Breakfast',
    description: 'Start your day with whole grains, protein, and fruits',
    icon: 'breakfast',
    category: 'diet',
    tips: [
      'Include oatmeal, eggs, or yogurt',
      'Add fresh fruits for vitamins',
      'Avoid sugary cereals'
    ]
  },
  {
    id: 'diet-2',
    title: 'Hydration',
    description: 'Drink 8-10 glasses of water daily',
    icon: 'water',
    category: 'diet',
    tips: [
      'Start your day with a glass of water',
      'Carry a water bottle',
      'Drink water before meals'
    ]
  },
  {
    id: 'diet-3',
    title: 'Fiber Intake',
    description: 'Include vegetables and whole grains in every meal',
    icon: 'vegetables',
    category: 'diet',
    tips: [
      'Eat 5 servings of vegetables daily',
      'Choose whole grain bread and pasta',
      'Add beans and lentils to meals'
    ]
  },
  {
    id: 'diet-4',
    title: 'Healthy Snacking',
    description: 'Choose nuts, fruits, or yogurt between meals',
    icon: 'snack',
    category: 'diet',
    tips: [
      'Prepare snacks in advance',
      'Avoid processed foods',
      'Keep portions moderate'
    ]
  }
];

const exerciseGuidance = [
  {
    id: 'exercise-1',
    title: 'Morning Walk',
    description: '30 minutes of brisk walking',
    duration: '30 minutes',
    icon: 'walking',
    category: 'exercise',
    benefits: [
      'Improves cardiovascular health',
      'Boosts energy levels',
      'Helps with weight management'
    ]
  },
  {
    id: 'exercise-2',
    title: 'Strength Training',
    description: 'Build muscle with bodyweight exercises',
    duration: '20 minutes',
    icon: 'strength',
    category: 'exercise',
    benefits: [
      'Increases muscle mass',
      'Boosts metabolism',
      'Improves bone density'
    ]
  },
  {
    id: 'exercise-3',
    title: 'Cardio Exercise',
    description: 'Jogging, cycling, or swimming',
    duration: '30-45 minutes',
    icon: 'cardio',
    category: 'exercise',
    benefits: [
      'Strengthens heart and lungs',
      'Burns calories',
      'Reduces stress'
    ]
  },
  {
    id: 'exercise-4',
    title: 'Stretching',
    description: 'Daily flexibility exercises',
    duration: '10-15 minutes',
    icon: 'stretch',
    category: 'exercise',
    benefits: [
      'Improves flexibility',
      'Prevents injuries',
      'Reduces muscle tension'
    ]
  }
];

const yogaGuidance = [
  {
    id: 'yoga-1',
    title: 'Surya Namaskar',
    description: 'Sun salutation for overall wellness',
    duration: '10 minutes',
    icon: 'yoga-sun',
    category: 'yoga',
    benefits: [
      'Full body workout',
      'Improves flexibility',
      'Energizes the body'
    ]
  },
  {
    id: 'yoga-2',
    title: 'Pranayama',
    description: 'Breathing exercises for relaxation',
    duration: '10-15 minutes',
    icon: 'breathing',
    category: 'yoga',
    benefits: [
      'Reduces stress',
      'Improves lung capacity',
      'Calms the mind'
    ]
  },
  {
    id: 'yoga-3',
    title: 'Meditation',
    description: 'Mindfulness and mental clarity',
    duration: '15-20 minutes',
    icon: 'meditation',
    category: 'yoga',
    benefits: [
      'Reduces anxiety',
      'Improves focus',
      'Promotes emotional health'
    ]
  },
  {
    id: 'yoga-4',
    title: 'Shavasana',
    description: 'Relaxation pose for recovery',
    duration: '5-10 minutes',
    icon: 'relaxation',
    category: 'yoga',
    benefits: [
      'Reduces stress',
      'Promotes deep relaxation',
      'Aids in recovery'
    ]
  }
];

const precautionsGuidance = [
  {
    id: 'precaution-1',
    title: 'Regular Check-ups',
    description: 'Visit your doctor for routine health screenings',
    frequency: 'Every 6 months',
    icon: 'checkup',
    category: 'precaution',
    importance: 'high'
  },
  {
    id: 'precaution-2',
    title: 'Hand Hygiene',
    description: 'Wash hands regularly with soap',
    frequency: 'Multiple times daily',
    icon: 'hygiene',
    category: 'precaution',
    importance: 'high'
  },
  {
    id: 'precaution-3',
    title: 'Adequate Sleep',
    description: 'Get 7-8 hours of quality sleep',
    frequency: 'Daily',
    icon: 'sleep',
    category: 'precaution',
    importance: 'high'
  },
  {
    id: 'precaution-4',
    title: 'Stress Management',
    description: 'Practice relaxation techniques',
    frequency: 'Daily',
    icon: 'stress',
    category: 'precaution',
    importance: 'medium'
  }
];

const getDietGuidance = () => {
  return dietGuidance;
};

const getExerciseGuidance = () => {
  return exerciseGuidance;
};

const getYogaGuidance = () => {
  return yogaGuidance;
};

const getPrecautionsGuidance = () => {
  return precautionsGuidance;
};

module.exports = {
  getDietGuidance,
  getExerciseGuidance,
  getYogaGuidance,
  getPrecautionsGuidance
};
