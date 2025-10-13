import React, { useState, useRef, useEffect } from 'react';
// Import all necessary icons for the dropdown button and the menu items
import { 
  EllipsisVerticalIcon, // The three-dot icon
  TrashIcon,          // For Delete
  PhotoIcon,          // For Add Pictures
  PencilSquareIcon    // For Edit Notes
} from '@heroicons/react/24/solid';
import { toast } from "react-hot-toast";

import { useMediaStore } from "@/context/MediaStore";

interface DropdownMenuProps {
  memoryId: string;
}

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
export const DropdownMenu: React.FC<DropdownMenuProps> = ({memoryId}) => {
  // State for controlling visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { deleteMemory } = useMediaStore();

  // Removed useRef and useEffect (click-outside logic) as requested
  // NOTE: The click-outside behavior is no longer implemented.

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Confirmation needed to delete the memory
  const handleAction = (action: string) => {
    if (action === "delete" && memoryId) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-800">Are you sure you want to delete this memory?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  handleDelete();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    }
  };

  const handleDelete = async() => {
     if (memoryId) {
        const deletingToast = toast.loading("Deleting memory! Wait for a minute."); // show loading toast
        try {
           await deleteMemory(memoryId);
            toast.success("Memory deleted successfully", { id: deletingToast });
        } catch (error) {
          console.log("Failed to delete memory!!!", error);
          toast.error("Failed to delete memory", { id: deletingToast });
        }
     }
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
