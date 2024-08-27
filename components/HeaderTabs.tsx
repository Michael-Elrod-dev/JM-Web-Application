import React, { useState, useEffect } from 'react';

interface Tab {
  name: string;
  href: string;
}

interface HeaderTabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

const HeaderTabs: React.FC<HeaderTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  const [activeTabElement, setActiveTabElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.getElementById(`tab-${activeTab}`);
    setActiveTabElement(element);
  }, [activeTab]);

  return (
    <div className="mt-6">
    <div className="flex relative">
      {tabs.map((tab) => (
        <a
          key={tab.name}
          id={`tab-${tab.name}`}
          href={tab.href}
          className={`
            px-6 py-2 
            ${activeTab === tab.name 
              ? 'text-gray-900 font-medium' 
              : 'text-gray-500 hover:text-gray-900'
            }
          `}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(tab.name);
          }}
        >
          {tab.name}
        </a>
      ))}
      {activeTabElement && (
        <div
          className="absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300"
          style={{
            left: `${activeTabElement.offsetLeft}px`,
            width: `${activeTabElement.offsetWidth}px`,
          }}
        />
      )}
    </div>
    </div>
  );
};

export default HeaderTabs;
