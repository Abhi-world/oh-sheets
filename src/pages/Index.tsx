import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ConnectionStatus from '@/components/ConnectionStatus';
import DateTriggerForm from '@/components/DateTriggerForm';
import PeriodicExportForm from '@/components/PeriodicExportForm';
import StatusTriggerForm from '@/components/StatusTriggerForm';
import ItemCreationTriggerForm from '@/components/ItemCreationTriggerForm';
import ColumnChangeTriggerForm from '@/components/ColumnChangeTriggerForm';
import PersonAssignmentTriggerForm from '@/components/PersonAssignmentTriggerForm';
import CustomValueTriggerForm from '@/components/CustomValueTriggerForm';
import FormSubmissionTriggerForm from '@/components/FormSubmissionTriggerForm';
import ButtonClickTriggerForm from '@/components/ButtonClickTriggerForm';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [mondayConnected, setMondayConnected] = useState(false);
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    try {
      console.log("Checking connections...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found, redirecting to login");
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('monday_api_key, google_sheets_credentials')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Profile data:", profile);
      setMondayConnected(!!profile?.monday_api_key);
      setSheetsConnected(!!profile?.google_sheets_credentials);
    } catch (error) {
      console.error('Error checking connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (service: 'monday' | 'sheets') => {
    console.log(`Connecting to ${service}...`);
    if (service === 'monday') {
      navigate('/connect-monday');
    } else {
      navigate('/connect-sheets');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Successfully logged out');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-navy">
              Monday.com + Google Sheets Integration
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            <ConnectionStatus service="monday" isConnected={mondayConnected} />
            <ConnectionStatus service="sheets" isConnected={sheetsConnected} />
          </div>
        </header>

        <main className="space-y-8">
          {(!mondayConnected || !sheetsConnected) && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">First, Connect Your Services</h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                {!mondayConnected && (
                  <div className="flex-1 p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Connect Monday.com</h3>
                    <p className="text-gray-600 mb-4">Connect your Monday.com account to start syncing data.</p>
                    <Button
                      onClick={() => handleConnect('monday')}
                      className="w-full bg-[#ff3d57] hover:bg-[#ff3d57]/90"
                    >
                      Connect Monday.com
                    </Button>
                  </div>
                )}
                {!sheetsConnected && (
                  <div className="flex-1 p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Connect Google Sheets</h3>
                    <p className="text-gray-600 mb-4">Connect your Google Sheets account to enable data syncing.</p>
                    <Button
                      onClick={() => handleConnect('sheets')}
                      className="w-full bg-[#34a853] hover:bg-[#34a853]/90"
                    >
                      Connect Google Sheets
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {mondayConnected && sheetsConnected && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Date-Based Automation",
                  description: "Automatically add data to Google Sheets when a specific date is reached in Monday.com. Perfect for deadline tracking and milestone management.",
                  component: DateTriggerForm
                },
                {
                  title: "Scheduled Data Export",
                  description: "Set up regular data exports from Monday.com to Google Sheets on an hourly, daily, weekly, or monthly basis.",
                  component: PeriodicExportForm
                },
                {
                  title: "Status Change Sync",
                  description: "Monitor status changes in Monday.com and automatically update or create new rows in Google Sheets when specific statuses are set.",
                  component: StatusTriggerForm
                },
                {
                  title: "New Item Sync",
                  description: "Automatically add new rows to Google Sheets whenever new items are created in Monday.com boards.",
                  component: ItemCreationTriggerForm
                },
                {
                  title: "Column Value Monitor",
                  description: "Track changes in specific Monday.com columns and sync the data to Google Sheets when values match your criteria.",
                  component: ColumnChangeTriggerForm
                },
                {
                  title: "Team Member Assignment",
                  description: "Keep track of task assignments by syncing person column changes from Monday.com to Google Sheets.",
                  component: PersonAssignmentTriggerForm
                },
                {
                  title: "Custom Value Integration",
                  description: "Create custom triggers based on specific values in Monday.com columns to sync data to Google Sheets.",
                  component: CustomValueTriggerForm
                },
                {
                  title: "Form Response Sync",
                  description: "Automatically sync Monday.com form submissions to Google Sheets for better data organization.",
                  component: FormSubmissionTriggerForm
                },
                {
                  title: "Button Action Sync",
                  description: "Trigger data sync to Google Sheets when specific buttons are clicked in Monday.com.",
                  component: ButtonClickTriggerForm
                }
              ].map((template, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-navy p-4">
                    <h2 className="text-xl font-semibold text-white mb-2">{template.title}</h2>
                    <p className="text-gray-300 text-sm">{template.description}</p>
                  </div>
                  <div className="p-4">
                    <template.component />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
