import { useState } from "react";
import { Icon, Icons } from "../components/Icon";
import { Btn, Card } from "../components/UI";
import Header from "../components/Header";
import PeopleTable from "../components/PeopleTable";

export default function PeopleList({ people, setPage, onSelectPerson }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filtered = people.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.address || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchPriority = filterPriority === "all" || p.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title="Муктаж адамдар"
        subtitle={`Жалпы ${people.length} адам каттоодо`}
        actions={
          <Btn onClick={() => setPage("people_add")} size="sm">
            <Icon d={Icons.plus} size={14} /> Жаңы адам
          </Btn>
        }
      />
      <div className="p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Бир гана издөө иконкасы — мурунку кайталануу катасы оңдолду */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon d={Icons.search} size={16} stroke="#94a3b8" />
              </div>
              <input
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                placeholder="Аты же дареги боюнча издөө..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Бардык статус</option>
              <option value="pending">Күтүүдө</option>
              <option value="in_progress">Иштелүүдө</option>
              <option value="helped">Жардам берилди</option>
            </select>
            <select
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Бардык приоритет</option>
              <option value="high">Жогорку</option>
              <option value="medium">Орточо</option>
              <option value="low">Төмөн</option>
            </select>
          </div>
        </Card>

        {/* Responsive table / card list */}
        <PeopleTable people={filtered} onSelect={onSelectPerson} />
      </div>
    </div>
  );
}
