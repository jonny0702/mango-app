import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/components/mango/ChatHeader";
import { ChatBubble, type Message } from "@/components/mango/ChatBubble";
import { ChatInput } from "@/components/mango/ChatInput";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { WifiOff, Wifi, Sprout } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Mango App · Asistente de Campo" },
      {
        name: "description",
        content:
          "Asistente de campo de Mango App: conecta productores locales con comercios en Panamá.",
      },
      { property: "og:title", content: "Mango App · Asistente de Campo" },
      {
        property: "og:description",
        content:
          "Asistente de campo de Mango App: conecta productores locales con comercios en Panamá.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "¡Hola! Soy tu Asistente de Campo. ¿Qué producto querés ofrecer hoy?",
    timestamp: "08:30",
  },
  {
    id: "2",
    role: "user",
    content: "Tengo papa lista para vender, ¿qué precio me conviene?",
    timestamp: "08:31",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "En tu zona el precio promedio de la papa está en $0.65/lb. Te sugiero publicar a $0.80/lb para maximizar tu margen.",
    timestamp: "08:32",
    offer: {
      product: "Papa",
      quantity: "50 Quintales",
      price: "$0.80 / lb",
    },
  },
];

function Index() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isOnline, setIsOnline] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simula fluctuaciones de conexión cada 12 segundos para mostrar el pill dinámico
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline((prev) => {
        const next = !prev;
        if (next) {
          toast.success("Conexión restablecida", { icon: <Wifi className="h-4 w-4" /> });
        } else {
          toast.warning("Modo offline", { icon: <WifiOff className="h-4 w-4" /> });
        }
        return next;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Scroll automático al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("es-PA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    addMessage(userMessage);

    // Simula respuesta del asistente
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Recibido. Veo que tienes papa disponible. Con base en la demanda actual, te armé esta cotización:",
        timestamp: new Date().toLocaleTimeString("es-PA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        offer: {
          product: "Papa",
          quantity: "50 Quintales",
          price: "$0.80 / lb",
        },
      };
      addMessage(assistantMessage);
    }, 1500);
  };

  const handlePublishOffer = () => {
    toast.success("Oferta publicada en el marketplace de Mango App", {
      description: "Los compradores cercanos podrán ver tu cotización.",
    });
  };

  return (
    <div className="min-h-screen bg-mango-cream">
      {/* ============ MÓVIL / TABLET: vista de app ============ */}
      <div className="lg:hidden">
        <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-card">
          <ChatHeader isOnline={isOnline} />
          <main className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  onPublishOffer={handlePublishOffer}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </main>
          <div className="mx-auto w-full max-w-2xl">
            <ChatInput onSend={handleSend} disabled={!isOnline || isTyping} />
          </div>
        </div>
      </div>

      {/* ============ DESKTOP: layout de aplicación completa ============ */}
      <div className="hidden lg:flex lg:h-screen lg:flex-col">
        {/* Barra superior */}
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mango-green text-xl shadow-sm">
              🥭
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Mango App</p>
              <p className="text-xs text-muted-foreground">
                Asistente de Campo · Panamá
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isOnline
                  ? "bg-mango-green/10 text-mango-green"
                  : "bg-mango-orange/10 text-mango-orange"
              }`}
            >
              {isOnline ? (
                <Wifi className="h-3.5 w-3.5" />
              ) : (
                <WifiOff className="h-3.5 w-3.5" />
              )}
              {isOnline ? "En línea" : "Sin conexión"}
            </span>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Panel lateral de contexto */}
          <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Resumen de hoy
            </h2>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Precio papa (tu zona)</p>
              <p className="mt-1 text-2xl font-bold text-mango-green">$0.65/lb</p>
              <p className="text-xs text-muted-foreground">Promedio del mercado local</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Demanda cercana</p>
              <p className="mt-1 text-2xl font-bold text-foreground">Alta</p>
              <p className="text-xs text-muted-foreground">
                12 comercios buscando productos frescos
              </p>
            </div>

            <div className="rounded-2xl border border-mango-orange/30 bg-mango-orange/5 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-mango-orange">
                <Sprout className="h-4 w-4" /> Consejo del día
              </p>
              <p className="mt-2 text-sm text-foreground">
                Publicá temprano: las ofertas antes de las 9 a.m. reciben un 40% más
                de interés de los compradores.
              </p>
            </div>

            <div className="mt-auto rounded-2xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Tu perfil</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Productor verificado
              </p>
              <p className="text-xs text-muted-foreground">Zona: Chiriquí</p>
            </div>
          </aside>

          {/* Área de chat */}
          <div className="flex flex-1 flex-col">
            <main className="flex-1 overflow-y-auto px-8 py-6">
              <div className="mx-auto flex max-w-3xl flex-col gap-5">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    onPublishOffer={handlePublishOffer}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>
            </main>
            <div className="border-t border-border bg-card px-8 py-4">
              <div className="mx-auto max-w-3xl">
                <ChatInput onSend={handleSend} disabled={!isOnline || isTyping} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-full flex-row gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <span className="text-xs">🥭</span>
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-mango-green" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-mango-green [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-mango-green [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
