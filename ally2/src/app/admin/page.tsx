import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - NutriChat",
  description: "Dietitian admin dashboard for NutriChat",
};

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Dietitian Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Active Users</h2>
          <p className="text-4xl font-bold text-primary">24</p>
          <p className="text-sm text-gray-500 mt-1">+3 from last week</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Reviews</h2>
          <p className="text-4xl font-bold text-orange-500">8</p>
          <p className="text-sm text-gray-500 mt-1">Users waiting for feedback</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Avg. Health Score</h2>
          <p className="text-4xl font-bold text-green-500">68</p>
          <p className="text-sm text-gray-500 mt-1">+5.2 from last month</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-primary text-white font-medium">
          <h2>Users Requiring Attention</h2>
        </div>
        <div className="p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concern</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">JD</div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                      <div className="text-sm text-gray-500">john.doe@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-orange-500 font-medium">48</div>
                  <div className="text-xs text-gray-500">-5 this week</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 days ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High Sodium Intake</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-primary hover:text-primary-dark">Review</a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">JS</div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                      <div className="text-sm text-gray-500">jane.smith@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-yellow-500 font-medium">62</div>
                  <div className="text-xs text-gray-500">+2 this week</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Protein</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-primary hover:text-primary-dark">Review</a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">RJ</div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Robert Johnson</div>
                      <div className="text-sm text-gray-500">robert.j@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-orange-500 font-medium">55</div>
                  <div className="text-xs text-gray-500">-3 this week</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Excessive Sugar</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-primary hover:text-primary-dark">Review</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-primary text-white font-medium">
            <h2>Recent User Activity</h2>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">AS</div>
                <div>
                  <p className="text-sm"><span className="font-medium">Alice Smith</span> followed a recommendation for a healthier alternative at Chipotle</p>
                  <p className="text-xs text-gray-500 mt-1">Today, 10:23 AM</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">MB</div>
                <div>
                  <p className="text-sm"><span className="font-medium">Michael Brown</span> completed their weekly nutrition assessment</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday, 4:45 PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">EW</div>
                <div>
                  <p className="text-sm"><span className="font-medium">Emma Wilson</span> connected their UberEats account</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday, 2:12 PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">JD</div>
                <div>
                  <p className="text-sm"><span className="font-medium">John Doe</span> requested a consultation with a dietitian</p>
                  <p className="text-xs text-gray-500 mt-1">Mar 17, 9:30 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-primary text-white font-medium">
            <h2>Pending Recommendations</h2>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              <li className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Jane Smith</h3>
                    <p className="text-sm text-gray-600">Health Score: 62</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Protein</span>
                </div>
                <p className="text-sm mb-3">User has consistently low protein intake over the past 2 weeks. Consider recommending high-protein meal alternatives and supplements.</p>
                <div className="flex justify-end">
                  <button className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark">Send Recommendation</button>
                </div>
              </li>
              <li className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Robert Johnson</h3>
                    <p className="text-sm text-gray-600">Health Score: 55</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Excessive Sugar</span>
                </div>
                <p className="text-sm mb-3">User frequently orders high-sugar beverages and desserts. Suggest sugar-free alternatives and educate on hidden sugars in foods.</p>
                <div className="flex justify-end">
                  <button className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark">Send Recommendation</button>
                </div>
              </li>
              <li>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Emma Wilson</h3>
                    <p className="text-sm text-gray-600">Health Score: 70</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">New User</span>
                </div>
                <p className="text-sm mb-3">New user who recently connected their UberEats account. Initial assessment shows good habits but opportunity for more vegetable intake.</p>
                <div className="flex justify-end">
                  <button className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark">Send Recommendation</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
