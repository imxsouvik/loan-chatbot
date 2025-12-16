import React, { useEffect } from "react";
import { useLoan } from "@/contexts/LoanContext";
import { formatCurrency } from "@/utils/validation";

const MyApplications = () => {
  const { applications } = useLoan();

  useEffect(() => {
    console.log('Applications updated:', applications);
  }, [applications]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Applications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Loan Application History</h2>
        
        {applications.length === 0 ? (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">No active applications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-lg">{app.type} Loan</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="mr-4">Amount: {formatCurrency(Number(app.amount))}</span>
                    <span>Tenure: {app.tenure} months</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(app.date).toLocaleDateString()} at {new Date(app.date).toLocaleTimeString()}</p>
                </div>
                <div>
                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                     app.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                     app.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                     'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                   }`}>
                     {app.status}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;