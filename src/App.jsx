import { useState, useEffect, useCallback } from "react";
import { Icon, Icons } from "./components/Icon";
import Sidebar from "./components/Sidebar";
import { Spinner } from "./components/UI";
import { useAuth } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import PeopleList from "./pages/PeopleList";
import AddPerson from "./pages/AddPerson";
import PersonCard from "./pages/PersonCard";
import AidPage from "./pages/AidPage";
import ReportsPage from "./pages/ReportsPage";
import VolunteersPage from "./pages/VolunteersPage";
import FinancePage from "./pages/FinancePage";
import LoginPage from "./pages/LoginPage";

import { fetchPeople } from "./data/peopleApi";
import { fetchVolunteers } from "./data/volunteersApi";

export default function App() {
  const { user, loading: authLoading } = useAuth();

  const [page, setPage] = useState("dashboard");
  const [people, setPeople] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);
    const [peopleResult, volunteersResult] = await Promise.all([fetchPeople(), fetchVolunteers()]);

    if (peopleResult.error) {
      setDataError("Маалымат жүктөөдө ката кетти: " + peopleResult.error.message);
    } else {
      setPeople(peopleResult.data || []);
    }

    if (!volunteersResult.error) {
      setVolunteers(volunteersResult.data || []);
    }

    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // Not logged in → show login screen
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Spinner size={28} className="text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handlePersonAdded = (newPerson) => {
    setPeople((prev) => [newPerson, ...prev]);
  };

  const handlePersonUpdated = (updatedPerson) => {
    setPeople((prev) => prev.map((p) => (p.id === updatedPerson.id ? { ...p, ...updatedPerson } : p)));
    setSelectedPerson((sp) => (sp?.id === updatedPerson.id ? { ...sp, ...updatedPerson } : sp));
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setPage("person_card");
  };

  const goToPage = (p) => {
    setPage(p);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    if (dataLoading) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <Spinner size={28} className="text-blue-600" />
        </div>
      );
    }

    switch (page) {
      case "dashboard":
        return <Dashboard people={people} volunteers={volunteers} setPage={goToPage} onSelectPerson={handleSelectPerson} />;
      case "people":
        return <PeopleList people={people} setPage={goToPage} onSelectPerson={handleSelectPerson} />;
      case "people_add":
        return <AddPerson setPage={goToPage} onAdded={handlePersonAdded} />;
      case "person_card":
        return <PersonCard person={selectedPerson} setPage={goToPage} onPersonUpdated={handlePersonUpdated} />;
      case "aid":
        return <AidPage people={people} />;
      case "reports":
        return <ReportsPage people={people} />;
      case "volunteers":
        return <VolunteersPage volunteers={volunteers} />;
      case "finance":
        return <FinancePage people={people} />;
      default:
        return <Dashboard people={people} volunteers={volunteers} setPage={goToPage} onSelectPerson={handleSelectPerson} />;
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden font-sans">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        transition-transform duration-200
      `}
      >
        <Sidebar page={page} setPage={goToPage} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-xl hover:bg-slate-100">
            <Icon d={Icons.menu} size={20} stroke="#1e293b" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Icon d={Icons.heart} size={14} stroke="white" />
            </div>
            <span className="text-sm font-bold text-slate-900">КыргызЖардам</span>
          </div>
          <button className="p-2 rounded-xl hover:bg-slate-100 relative">
            <Icon d={Icons.bell} size={18} stroke="#64748b" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        {dataError && (
          <div className="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-medium border-b border-red-100">
            {dataError}
          </div>
        )}

        {/* Page content */}
        <div className="flex-1 flex overflow-hidden">{renderPage()}</div>
      </div>
    </div>
  );
}
