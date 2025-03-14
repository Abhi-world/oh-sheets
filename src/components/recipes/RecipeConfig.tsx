import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RecipeConfigLayout from './RecipeConfigLayout';
import StatusChangeConfig from './configs/StatusChangeConfig';
import DateTriggerConfig from './configs/DateTriggerConfig';
import GroupMoveConfig from './configs/GroupMoveConfig';
import PeriodicExportConfig from './configs/PeriodicExportConfig';
import FormSubmissionConfig from './configs/FormSubmissionConfig';
import PersonAssignmentConfig from './configs/PersonAssignmentConfig';
import ButtonClickConfig from './configs/ButtonClickConfig';
import ColumnChangeConfig from './configs/ColumnChangeConfig';
import ItemCreationConfig from './configs/ItemCreationConfig';
import { toast } from 'sonner';
import { ConfigComponentProps } from '@/types/recipe';

const recipeConfigs: Record<string, { 
  component: React.ComponentType<ConfigComponentProps>, 
  title: string,
  automationType: 'status' | 'date' | 'button' | 'column' | 'person' | 'group' | 'item' | 'form' | 'periodic'
}> = {
  'status-change': {
    component: StatusChangeConfig,
    title: 'Status Change Integration',
    automationType: 'status'
  },
  'date-trigger': {
    component: DateTriggerConfig,
    title: 'Date-Based Integration',
    automationType: 'date'
  },
  'group-move': {
    component: GroupMoveConfig,
    title: 'Group Movement Integration',
    automationType: 'group'
  },
  'periodic-export': {
    component: PeriodicExportConfig,
    title: 'Scheduled Export',
    automationType: 'periodic'
  },
  'form-submission': {
    component: FormSubmissionConfig,
    title: 'Form Response Integration',
    automationType: 'form'
  },
  'person-assignment': {
    component: PersonAssignmentConfig,
    title: 'Person Assignment Integration',
    automationType: 'person'
  },
  'button-click': {
    component: ButtonClickConfig,
    title: 'Button Click Integration',
    automationType: 'button'
  },
  'column-change': {
    component: ColumnChangeConfig,
    title: 'Column Change Integration',
    automationType: 'column'
  },
  'item-creation': {
    component: ItemCreationConfig,
    title: 'New Item Integration',
    automationType: 'item'
  }
};

const RecipeConfig = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [isConfigValid, setIsConfigValid] = useState(false);

  if (!recipeId || !recipeConfigs[recipeId]) {
    return <div>Recipe not found</div>;
  }

  const config = recipeConfigs[recipeId];
  const ConfigComponent = config.component;

  const handleCreateAutomation = () => {
    if (!isConfigValid) {
      toast.error('Please complete all required fields');
      return;
    }
    
    console.log('Creating automation with current configuration');
    toast.success('Automation created successfully');
    navigate('/');
  };

  return (
    <RecipeConfigLayout 
      title={config.title}
      automationType={config.automationType}
    >
      <div className="space-y-8">
        <ConfigComponent onConfigValid={setIsConfigValid} />
        <Button 
          size="lg"
          className="w-full bg-recipe-green hover:bg-recipe-darkGreen text-white py-6 text-lg rounded-full"
          onClick={handleCreateAutomation}
          disabled={!isConfigValid}
        >
          Create Automation
        </Button>
      </div>
    </RecipeConfigLayout>
  );
};

export default RecipeConfig;