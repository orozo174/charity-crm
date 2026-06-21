import { useState, useRef } from "react";
import { Icon, Icons } from "../components/Icon";
import { Btn, Card, Avatar, Badge, Spinner, ErrorBanner } from "../components/UI";
import Header from "../components/Header";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../utils/constants";
import { formatMoney } from "../utils/format";
import { updatePersonStatus, updatePersonComment } from "../data/peopleApi";
import { uploadAndAttachToPerson, validateMediaFile } from "../data/mediaApi";
import { useAuth } from "../context/AuthContext";

export default function PersonCard({ person, setPage, onPersonUpdated }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentSaving, setCommentSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!person) return null;

  const tabs = [
    { id: "info", label: "Маалымат" },
    { id: "aid", label: "Жардам тарыхы" },
    { id: "media", label: "Медиа" },
    { id: "comments", label: "Комментарийлер" },
  ];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === person.status) return;
    setStatusSaving(true);
    setStatusError(null);
    const { data, error } = await updatePersonStatus(person.id, newStatus);
    setStatusSaving(false);
    if (error) {
      setStatusError("Статусту сактоодо ката кетти: " + error.message);
      return;
    }
    onPersonUpdated({ ...person, status: newStatus });
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setCommentSaving(true);
    const { error } = await updatePersonComment(person.id, commentText);
    setCommentSaving(false);
    if (!error) {
      onPersonUpdated({ ...person, comments: commentText });
      setCommentText("");
    }
  };

  const handleFileSelect = async (e, mediaType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file, mediaType);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploading(true);
    setUploadError(null);
    const { data, error } = await uploadAndAttachToPerson(file, mediaType, person.id, user?.id);
    setUploading(false);

    if (error) {
      setUploadError("Жүктөөдө ката кетти: " + error.message);
      return;
    }

    const key = mediaType === "photo" ? "photos" : "videos";
    const updatedList = [...(person[key] || []), data];
    onPersonUpdated({ ...person, [key]: updatedList });

    e.target.value = "";
  };

  const photos = person.photos || [];
  const videos = person.videos || [];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title={person.name}
        subtitle={`${person.category} · ${(person.address || "").split(",")[0]}`}
        actions={
          <>
            <Btn variant="secondary" size="sm" onClick={() => setPage("people")}>
              <Icon d={Icons.chevronLeft} size={14} /> Артка
            </Btn>
            <Btn size="sm"><Icon d={Icons.edit} size={14} /> Түзөт</Btn>
          </>
        }
      />
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {person.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900">{person.name}</h2>
                  <Badge config={STATUS_CONFIG[person.status]} />
                  <Badge config={PRIORITY_CONFIG[person.priority]} />
                </div>
                <p className="text-sm text-slate-500 mt-1">{person.category}</p>
                <p className="text-sm text-slate-600 mt-2">{person.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
              {[
                { label: "Жашы", value: `${person.age} жаш` },
                { label: "Үй-бүлө", value: `${person.family_size} адам` },
                { label: "Балдар", value: `${person.children} бала` },
                { label: "Кошулган күнү", value: person.created_at?.split?.("T")?.[0] || person.created_at },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            <Card className="p-4">
              <p className="text-xs text-slate-400 font-medium mb-2">Байланыш</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Icon d={Icons.phone} size={14} stroke="#64748b" />
                  {person.phone}
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <Icon d={Icons.location} size={14} stroke="#64748b" />
                  <span className="text-xs">{person.address}</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400 font-medium mb-2">Жооптуу волонтер</p>
              <div className="flex items-center gap-2">
                <Avatar name={person.volunteer_name} size="sm" />
                <span className="text-sm font-medium text-slate-700">{person.volunteer_name}</span>
              </div>
            </Card>
            <div className="space-y-2">
              <ErrorBanner message={statusError} />
              <Btn
                className="w-full justify-center"
                onClick={() => handleStatusChange("helped")}
                size="sm"
                variant="success"
                disabled={statusSaving || person.status === "helped"}
              >
                {statusSaving ? <Spinner size={14} /> : <Icon d={Icons.check} size={14} />} Жардам берилди
              </Btn>
              <Btn
                className="w-full justify-center"
                onClick={() => handleStatusChange("in_progress")}
                size="sm"
                variant="secondary"
                disabled={statusSaving || person.status === "in_progress"}
              >
                {statusSaving ? <Spinner size={14} /> : null} Иштелүүдө
              </Btn>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-5">
            {activeTab === "info" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">Кошумча маалымат</h3>
                <p className="text-sm text-slate-600">{person.description}</p>
              </div>
            )}

            {activeTab === "aid" && (
              <div className="space-y-3">
                {(person.aid || []).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Жардам берилген жок</p>
                ) : (
                  person.aid.map((a, i) => (
                    <div key={a.id || i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{a.aid_type}</p>
                        <p className="text-xs text-slate-400">{a.aid_date} · {a.responsible_name}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 flex-shrink-0">{formatMoney(a.amount)}</span>
                    </div>
                  ))
                )}
                {(person.aid || []).length > 0 && (
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Жалпы</span>
                    <span className="text-base font-bold text-slate-900">
                      {formatMoney(person.aid.reduce((s, a) => s + Number(a.amount), 0))}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "media" && (
              <div>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "photo")} />
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileSelect(e, "video")} />

                <div className="flex gap-3 mb-4 flex-wrap items-center">
                  <Btn size="sm" variant="secondary" onClick={() => photoInputRef.current?.click()} disabled={uploading}>
                    <Icon d={Icons.camera} size={14} /> Сүрөт кош
                  </Btn>
                  <Btn size="sm" variant="secondary" onClick={() => videoInputRef.current?.click()} disabled={uploading}>
                    <Icon d={Icons.video} size={14} /> Видео кош
                  </Btn>
                  {uploading && <span className="text-xs text-slate-400 flex items-center gap-1.5"><Spinner size={13} /> Жүктөлүүдө...</span>}
                </div>

                {uploadError && <div className="mb-3"><ErrorBanner message={uploadError} /></div>}

                {photos.length === 0 && videos.length === 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <Icon d={Icons.camera} size={24} stroke="#cbd5e1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((p, i) => (
                      <img key={p.id || i} src={p.public_url} alt="" className="aspect-square object-cover rounded-xl bg-slate-100" />
                    ))}
                    {videos.map((v, i) => (
                      <video key={v.id || i} src={v.public_url} controls className="aspect-square object-cover rounded-xl bg-slate-900" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-4">
                {person.comments && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={person.volunteer_name} size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{person.volunteer_name}</p>
                        <p className="text-xs text-slate-400">{person.created_at?.split?.("T")?.[0] || person.created_at}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">{person.comments}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    placeholder="Комментарий жаз..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  />
                  <Btn size="sm" onClick={handleCommentSubmit} disabled={commentSaving || !commentText.trim()}>
                    {commentSaving ? <Spinner size={14} /> : "Жибер"}
                  </Btn>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
