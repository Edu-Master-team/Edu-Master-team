import { MdSettings } from 'react-icons/md';

const settingsSections = [
  {
    title: 'General Settings',
    items: [
      { name: 'Site Name', value: 'Admin Panel', type: 'text' },
      { name: 'Site Description', value: 'A modern admin dashboard', type: 'textarea' },
      { name: 'Timezone', value: 'UTC-8 (Pacific Time)', type: 'select' },
      { name: 'Language', value: 'English', type: 'select' },
    ],
  },
  {
    title: 'Email Settings',
    items: [
      { name: 'SMTP Host', value: 'smtp.example.com', type: 'text' },
      { name: 'SMTP Port', value: '587', type: 'number' },
      { name: 'From Email', value: 'noreply@example.com', type: 'email' },
      { name: 'Email Templates', value: 'Default', type: 'select' },
    ],
  },
  {
    title: 'Security Settings',
    items: [
      { name: 'Two-Factor Authentication', value: 'Enabled', type: 'toggle' },
      { name: 'Session Timeout', value: '30 minutes', type: 'select' },
      { name: 'Password Policy', value: 'Strong', type: 'select' },
      { name: 'Login Attempts', value: '5', type: 'number' },
    ],
  },
];

export default function Settings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your application settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <MdSettings className="h-6 w-6 text-gray-400 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.name}>
                    <label
                      htmlFor={item.name.toLowerCase().replace(/\s+/g, '-')}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {item.name}
                    </label>
                    {item.type === 'textarea' ? (
                      <textarea
                        id={item.name.toLowerCase().replace(/\s+/g, '-')}
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder-gray-500 sm:text-sm sm:leading-6"
                        defaultValue={item.value}
                      />
                    ) : item.type === 'toggle' ? (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                            item.value === 'Enabled' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                          role="switch"
                          aria-checked={item.value === 'Enabled'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              item.value === 'Enabled' ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          {item.value}
                        </span>
                      </div>
                    ) : (
                      <input
                        type={item.type}
                        id={item.name.toLowerCase().replace(/\s+/g, '-')}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder-gray-500 sm:text-sm sm:leading-6"
                        defaultValue={item.value}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
