import { useState, useRef } from "react";
import { Icon, Icons } from "../components/Icon";
import { Btn, Card, Spinner, ErrorBanner } from "../components/UI";
import Header from "../components/Header";
import { CATEGORIES, PRIORITY_CONFIG } from "../utils/constants";
import { OBLASTS, getDistricts, getStreets } from "../utils/addressData";
import { createPerson } from "../data/peopleApi";
import { uploadAndAttachToPerson, validateMediaFile } from "../data/mediaApi";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  { num: 1, label: "Негизги маалымат" },
  { num: 2, label: "Байланыш жана дарек" },
  { num: 3, label: "Үй-бүлө" },
  { num: 4, label: "Кошумча" },
];

export default function AddPerson({ setPage, onAdded }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [pendingVideos, setPendingVideos] = useState([]);
  const [mediaError, setMediaError] = useState(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "", age: "", phone: "",
    oblast: "", district: "", street: "", house: "",
    children: "", family_size: "", category: "Жалгыз ата-эне",
    priority: "medium", description: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = [];
    for (const file of files) {
      const v = validateMediaFile(file, "photo");
      if (v.valid) valid.push(file);
      else setMediaError(v.error);
    }
    setPendingPhotos((p) => [...p, ...valid]);
    e.target.value = "";
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validateMediaFile(file, "video");
    if (!v.valid) { setMediaError(v.error); return; }
    setPendingVideos((p) => [...p, file]);
    e.target.value = "";
  };

  const validateStep = () => {
    if (step === 1) return form.name.trim() && form.age;
    if (step === 2) return form.oblast && form.district;
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSaveError(null);
    const fullAddress = [form.oblast, form.district, form.street, form.house].filter(Boolean).join(", ");
    const { data: newPerson, error } = await createPerson({
      name: form.name,
      age: parseInt(form.age) || 0,
      phone: form.phone,
      region: form.oblast,
      address: fullAddress,
      children: parseInt(form.children) || 0,
      family_size: parseInt(form.family_size) || 1,
      category: form.category,
      priority: form.priority,
      description: form.description,
      volunteer_id: user?.id,
      volunteer_name: user?.full_name,
      created_by: user?.id,
    });
    if (error) {
      setSaving(false);
      setSaveError("Сактоодо ката кетти: " + error.message);
      return;
    }
    for (const file of pendingPhotos) {
      await uploadAndAttachToPerson(file, "photo", newPerson.id, user?.id);
    }
    for (const file of pendingVideos) {
      await uploadAndAttachToPerson(file, "video", newPerson.id, user?.id);
    }
    setSaving(false);
    onAdded(newPerson);
    setPage("people");
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title="Жаңы адам кошуу"
        subtitle="Муктаж адам жөнүндө маалымат"
        actions={
          <Btn variant="secondary" size="sm" onClick={() => setPage("people")}>
            <Icon d={Icons.x} size={14} /> Жокко чыгар
          </Btn>
        }
      />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1.5 sm:gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${step >= s.num ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {step > s.num ? <Icon d={Icons.check} size={12} stroke="white" /> : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:block truncate ${step === s.num ? "text-blue-700" : "text-slate-400"}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${step > s.num ? "bg-blue-600" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-4">Негизги маалымат</h2>
              <div>
                <label className={labelCls}>Аты-жөнү *</label>
                <input className={inputCls} placeholder="Мисалы: Айгүл Токтосунова" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Жашы *</label>
                  <input className={inputCls} type="number" placeholder="45" value={form.age} onChange={(e) => update("age", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Категория</label>
                  <select className={inputCls} value={form.category} onChange={(e) => update("category", e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Приоритет</label>
                <div className="flex gap-2">
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                    <button key={k} onClick={() => update("priority", k)}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-xl border-2 transition-colors ${form.priority === k ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-4">Байланыш жана дарек</h2>
              <div>
                <label className={labelCls}>Телефон номери</label>
                <input className={inputCls} placeholder="+996 700 000 000" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Облус / Шаар *</label>
                <select className={inputCls} value={form.oblast}
                  onChange={(e) => setForm(f => ({ ...f, oblast: e.target.value, district: "", street: "" }))}>
                  <option value="">Тандаңыз</option>
                  {OBLASTS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              {form.oblast && (
                <div>
                  <label className={labelCls}>Район / Айыл аймагы *</label>
                  <select className={inputCls} value={form.district}
                    onChange={(e) => setForm(f => ({ ...f, district: e.target.value, street: "" }))}>
                    <option value="">Тандаңыз</option>
                    {getDistricts(form.oblast).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              )}
              {form.district && (
                <div>
                  <label className={labelCls}>Көчө</label>
                  <select className={inputCls} value={form.street}
                    onChange={(e) => update("street", e.target.value)}>
                    <option value="">Тандаңыз</option>
                    {getStreets(form.oblast, form.district).map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input className={`${inputCls} mt-2`} placeholder="Же өзүңүз жазыңыз..."
                    value={form.street} onChange={(e) => update("street", e.target.value)} />
                </div>
              )}
              {form.district && (
                <div>
                  <label className={labelCls}>Үй номери / Квартира</label>
                  <input className={inputCls} placeholder="мис: 23-үй, 5-кв"
                    value={form.house} onChange={(e) => update("house", e.target.value)} />
                </div>
              )}
              {form.oblast && (
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium mb-1">Толук дарек:</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {[form.oblast, form.district, form.street, form.house].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-4">Үй-бүлө маалыматы</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Балдардын саны</label>
                  <input className={inputCls} type="number" placeholder="0" value={form.children} onChange={(e) => update("children", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Үй-бүлө мүчөлөрүнүн саны</label>
                  <input className={inputCls} type="number" placeholder="1" value={form.family_size} onChange={(e) => update("family_size", e.target.value)} />
                </div>
              </div>
              <p className="text-xs text-slate-400">Жооптуу волонтер: <strong>{user?.full_name}</strong></p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-4">Кошумча маалымат жана медиа</h2>
              <div>
                <label className={labelCls}>Кырдаалын сүрөттөө</label>
                <textarea className={`${inputCls} resize-none h-28`}
                  placeholder="Бул адамдын кырдаалы жана эмне жардам керек экени жөнүндө жаз..."
                  value={form.description} onChange={(e) => update("description", e.target.value)} />
              </div>
              {mediaError && <ErrorBanner message={mediaError} />}
              <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
              <div>
                <label className={labelCls}>Сүрөттөр {pendingPhotos.length > 0 && `(${pendingPhotos.length} тандалды)`}</label>
                <button type="button" onClick={() => photoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <Icon d={Icons.camera} size={28} stroke="#94a3b8" />
                  <p className="text-sm text-slate-400 mt-2">Сүрөт кошуу үчүн басыңыз</p>
                  <p className="text-xs text-slate-300 mt-1">PNG, JPG — 10MB чейин</p>
                </button>
                {pendingPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {pendingPhotos.map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} alt="" className="aspect-square object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
              <div>
                <label className={labelCls}>Видео {pendingVideos.length > 0 && `(${pendingVideos.length} тандалды)`}</label>
                <button type="button" onClick={() => videoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <Icon d={Icons.video} size={28} stroke="#94a3b8" />
                  <p className="text-sm text-slate-400 mt-2">Видео кошуу үчүн басыңыз</p>
                  <p className="text-xs text-slate-300 mt-1">MP4 — 100MB чейин</p>
                </button>
              </div>
            </div>
          )}
        </Card>

        {saveError && <ErrorBanner message={saveError} />}

        <div className="flex gap-3">
          {step > 1 && (
            <Btn variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1 justify-center" disabled={saving}>
              <Icon d={Icons.chevronLeft} size={14} /> Артка
            </Btn>
          )}
          {step < 4 ? (
            <Btn onClick={() => validateStep() && setStep((s) => s + 1)} className="flex-1 justify-center" disabled={!validateStep()}>
              Кийинки <Icon d={Icons.chevronRight} size={14} />
            </Btn>
          ) : (
            <Btn onClick={handleSubmit} className="flex-1 justify-center" variant="success" disabled={saving}>
              {saving ? <Spinner size={14} /> : <Icon d={Icons.check} size={14} />} Сактоо
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
