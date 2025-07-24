import { OnboardingStep } from '../hooks/useOnboarding';

export const onboardingSteps: OnboardingStep[] = [
  {
    icon: 'eco',
    iconFamily: 'MaterialIcons',
    title: 'Welcome to EcoTrack',
    description: 'Your companion for responsible outdoor adventures. Track your environmental impact and make every hike count.',
    highlight: 'Leave No Trace. Leave Only Footprints.',
  },
  {
    icon: 'recycling',
    iconFamily: 'MaterialIcons',
    title: 'Log Your Impact',
    description: 'Track cleanups, low-impact camping, and eco-friendly behavior on every adventure.',
    highlight: 'Every action counts',
  },
  {
    icon: 'trophy',
    iconFamily: 'Ionicons',
    title: 'Earn Sustainability Badges',
    description: 'Gamify your efforts and level up through responsible hiking and outdoor activities.',
    highlight: 'Reward your habits',
  },
  {
    icon: 'bar-chart',
    iconFamily: 'Ionicons',
    title: 'Visualize Your Contribution',
    description: 'See your positive impact on the environment across all your trips and adventures.',
    highlight: 'See the difference you make',
  },
];