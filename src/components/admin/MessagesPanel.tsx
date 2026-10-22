import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMessages, markMessageRead, deleteMessage, type Message } from "@/lib/firestore";
import { Mail, MailOpen, Trash2, Check, X, RefreshCw } from "lucide-react";

export function MessagesPanel() {
  const qc = useQueryClient();
  const { data: messages = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: fetchMessages,
  });

  const readMut = useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });
  const deleteMut = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const [selected, setSelected] = useState<Message | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const unread = messages.filter((m) => !m.read).length;

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Messages
            {unread > 0 && (
              <span className="bg-blue-500 text-white text-xs font-mono px-2 py-0.5 rounded-full">{unread} new</span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{messages.length} total messages from the contact form</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-foreground/15 px-3 py-1.5 rounded-lg transition-all"
        >
          <RefreshCw size={12} strokeWidth={1.75} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {messages.length === 0 && (
        <div className="text-center py-20 border border-dashed border-foreground/10 rounded-2xl">
          <Mail size={32} className="text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">No messages yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Messages sent via the contact form will appear here.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Message list */}
        <div className="space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => { setSelected(m); if (!m.read) readMut.mutate(m.id); }}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                selected?.id === m.id
                  ? "border-blue-500/50 bg-blue-500/5"
                  : m.read
                  ? "border-foreground/10 hover:border-foreground/20"
                  : "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {m.read
                    ? <MailOpen size={14} className="text-muted-foreground shrink-0" strokeWidth={1.75} />
                    : <Mail size={14} className="text-blue-500 shrink-0" strokeWidth={1.75} />
                  }
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${!m.read ? "font-semibold" : "font-medium"}`}>{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {confirmDelete === m.id ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); deleteMut.mutate(m.id); setConfirmDelete(null); if (selected?.id === m.id) setSelected(null); }}
                        className="p-1 rounded bg-red-500/10 text-red-400"><Check size={11} strokeWidth={2} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}
                        className="p-1 rounded hover:bg-foreground/5 text-muted-foreground"><X size={11} strokeWidth={2} /></button>
                    </>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(m.id); }}
                      className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all">
                      <Trash2 size={12} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{m.message}</p>
              {m.createdAt && (
                <p className="text-[10px] text-muted-foreground/50 mt-1.5 font-mono">
                  {m.createdAt.toDate().toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Message detail */}
        <div className="sticky top-4">
          {selected ? (
            <div className="border border-foreground/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{selected.name}</p>
                  <a href={`mailto:${selected.email}`} className="text-sm text-blue-500 hover:underline">{selected.email}</a>
                </div>
                {selected.createdAt && (
                  <span className="text-[10px] font-mono text-muted-foreground/60">
                    {selected.createdAt.toDate().toLocaleString()}
                  </span>
                )}
              </div>
              <div className="border-t border-foreground/10 pt-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a
                href={`mailto:${selected.email}?subject=Re: Your message on bitan.dev`}
                className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-all"
              >
                <Mail size={14} strokeWidth={1.75} />
                Reply via Email
              </a>
            </div>
          ) : (
            <div className="border border-dashed border-foreground/10 rounded-2xl p-8 text-center">
              <MailOpen size={28} className="text-muted-foreground/20 mx-auto mb-2" strokeWidth={1} />
              <p className="text-xs text-muted-foreground">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
