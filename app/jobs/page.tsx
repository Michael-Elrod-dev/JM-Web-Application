"use client";

import React, { useState, useRef, useEffect } from "react";
import HeaderTabs from "../../components/HeaderTabs";
import NewJobFrame from "../../components/NewJobFrame";
import LargeJobFrame from "../../components/LargeJobFrame";

interface HeaderProps {
  title: string;
  tabs: { name: string; href: string }[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = React.memo(({ title, tabs, activeTab, setActiveTab }) => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const currentRef = headerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: [1] }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-10 transition-all bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl font-bold mb-3 transition-all ${
            isScrolled ? "opacity-0 h-0" : "opacity-100 h-auto"
          }`}
        >
          {title}
        </h1>
        <HeaderTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </header>
  );
});
Header.displayName = "Header";

const ActiveTab = React.memo(() => (
  <div>
    <LargeJobFrame
      jobName="Home Renovation"
      dateRange="8/8/24 - 2/15/25"
      tasks={[
        "Contact gas company for layout",
        "Install new windows",
        "Paint interior walls",
      ]}
      materials={[
        "Contact plumber company for pipes",
        "Order lumber",
        "Purchase paint",
      ]}
      workers={["Michael Elrod", "Sarah Johnson", "Robert Lee"]}
      overdue={3}
      sevenDaysPlus={5}
      nextSevenDays={7}
    />
    <LargeJobFrame
      jobName="Office Building Construction"
      dateRange="9/1/24 - 3/30/25"
      tasks={[
        "Pour foundation",
        "Erect steel frame",
        "Install electrical systems",
      ]}
      materials={[
        "Order concrete",
        "Schedule steel delivery",
        "Purchase electrical components",
      ]}
      workers={["Emily Chen", "David Wilson", "Maria Garcia"]}
      overdue={2}
      sevenDaysPlus={8}
      nextSevenDays={10}
    />
    <LargeJobFrame
      jobName="Home Renovation"
      dateRange="8/8/24 - 2/15/25"
      tasks={[
        "Contact gas company for layout",
        "Install new windows",
        "Paint interior walls",
      ]}
      materials={[
        "Contact plumber company for pipes",
        "Order lumber",
        "Purchase paint",
      ]}
      workers={["Michael Elrod", "Sarah Johnson", "Robert Lee"]}
      overdue={1}
      sevenDaysPlus={6}
      nextSevenDays={8}
    />
    <LargeJobFrame
      jobName="Home Renovation"
      dateRange="8/8/24 - 2/15/25"
      tasks={[
        "Contact gas company for layout",
        "Install new windows",
        "Paint interior walls",
      ]}
      materials={[
        "Contact plumber company for pipes",
        "Order lumber",
        "Purchase paint",
      ]}
      workers={["Michael Elrod", "Sarah Johnson", "Robert Lee"]}
      overdue={4}
      sevenDaysPlus={3}
      nextSevenDays={5}
    />
  </div>
));
ActiveTab.displayName = "ActiveTab";

const ClosedTab = React.memo(() => (
  <div>
    <LargeJobFrame
      jobName="Home Renovation"
      dateRange="8/8/24 - 2/15/25"
      tasks={[
        "Contact gas company for layout",
        "Install new windows",
        "Paint interior walls",
      ]}
      materials={[
        "Contact plumber company for pipes",
        "Order lumber",
        "Purchase paint",
      ]}
      workers={["Michael Elrod", "Sarah Johnson", "Robert Lee"]}
      overdue={4}
      sevenDaysPlus={3}
      nextSevenDays={5}
    />
  </div>
));
ClosedTab.displayName = "ClosedTab";

const NewTab = React.memo(() => {
  return (
    <div className="mx-auto space-y-4">
      <NewJobFrame />
    </div>
  );
});
NewTab.displayName = "NewTab";

const RecycleBinTab = React.memo(() => (
  <div>
    <LargeJobFrame
      jobName="Abandoned Warehouse Conversion"
      dateRange="3/1/24 - 9/30/24"
      tasks={[
        "Structural assessment",
        "Demolition of interior walls",
        "New floor plan design",
      ]}
      materials={[
        "Recycled materials",
        "Eco-friendly insulation",
        "Energy-efficient windows",
      ]}
      workers={["Ryan Peters", "Sophie Wong", "Marcus Johnson"]}
      overdue={5}
      sevenDaysPlus={0}
      nextSevenDays={0}
    />
  </div>
));
RecycleBinTab.displayName = "RecycleBinTab";

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("Active");

  const headerTabs = [
    { name: "Active", href: "#" },
    { name: "Closed", href: "#" },
    { name: "New", href: "#" },
    { name: "Recycle Bin", href: "#" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Active":
        return <ActiveTab />;
      case "Closed":
        return <ClosedTab />;
      case "New":
        return <NewTab />;
      case "Recycle Bin":
        return <RecycleBinTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <Header
          title="Jobs"
          tabs={headerTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
}