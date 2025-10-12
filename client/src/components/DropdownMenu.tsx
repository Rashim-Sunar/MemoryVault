import React, { useState, useRef, useEffect } from 'react';
// Import all necessary icons for the dropdown button and the menu items
import { 
  EllipsisVerticalIcon, // The three-dot icon
  TrashIcon,          // For Delete
  PhotoIcon,          // For Add Pictures
  PencilSquareIcon    // For Edit Notes
} from '@heroicons/react/24/solid';

// 1. Define the type for a single menu item
interface MenuItem {
  label: string;
  action: string;
  classes: string;
  // Use React.ElementType for the Icon component type
  Icon: React.ElementType;
}

// 2. Define the list of menu items using the MenuItem type and assign icons
const menuItems: MenuItem[] = [
  { label: 'Delete', action: 'delete', classes: 'text-red-600 hover:bg-red-50', Icon: TrashIcon },
  { label: 'Add Media', action: 'addPictures', classes: 'text-gray-700 hover:bg-gray-100', Icon: PhotoIcon },
  { label: 'Edit Note', action: 'editNotes', classes: 'text-gray-700 hover:bg-gray-100', Icon: PencilSquareIcon },
];

// 3. Use React.FC (Function Component) for explicit typing
export const DropdownMenu: React.FC = () => {
  // State for controlling visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Removed useRef and useEffect (click-outside logic) as requested
  // NOTE: The click-outside behavior is no longer implemented.

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handler for menu item selection, explicitly typed for the 'action' parameter
  const handleAction = (action: string) => {
    // NOTE: Using console.log instead of alert()
    console.log(`Action selected: ${action}`);
    setIsOpen(false); // Close menu after selection
  };

  return (
    // Ref removed from this container
    <div className="relative inline-block text-left">
      {/* Dropdown Toggle Button (3-dot vertical icon) */}
      <button
        type="button"
        // Added text-white to make the dots white, and bg-gray-700 for better contrast
        className="inline-flex justify-center items-center p-2 rounded-full text-white  hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Dropdown Menu List */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-white ring-1 ring-gray-900 ring-opacity-5 divide-y divide-gray-100 z-50 transform transition duration-150 ease-out animate-in fade-in slide-in-from-top-1"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {menuItems.map((item) => (
              <a
                key={item.action}
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  handleAction(item.action);
                }}
                // Added flex and space-x-2 to align the icon and label
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${item.classes} transition duration-100 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                role="menuitem"
              >
                {/* Render the icon component */}
                <item.Icon className={`h-4 w-4 ${item.action === 'delete' ? 'text-red-500' : 'text-gray-400'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
