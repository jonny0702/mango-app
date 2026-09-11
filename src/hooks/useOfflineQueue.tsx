import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";

export interface OfferPayload {
  id: string;
  product: string;
  quantity: string;
  price: string;
  timestamp: string;
}

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== "undefined" ? window.navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Conexión restablecida", {
        description: "Sincronizando datos...",
        icon: <Wifi className="h-4 w-4" />,
      });
      flushQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Modo offline", {
        description: "Tus acciones se guardarán localmente.",
        icon: <WifiOff className="h-4 w-4" />,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const queueOffer = (offer: OfferPayload) => {
    const currentQueue: OfferPayload[] = JSON.parse(
      localStorage.getItem("offer_queue") || "[]"
    );
    currentQueue.push(offer);
    localStorage.setItem("offer_queue", JSON.stringify(currentQueue));
    toast.info("Oferta guardada localmente", {
      description: "Se publicará automáticamente cuando vuelva la conexión.",
    });
  };

  const publishOffer = async (offer: OfferPayload) => {
    if (!isOnline) {
      queueOffer(offer);
      return;
    }

    try {
      // AQUÍ IRÁ LA LLAMADA AL BACKEND TRADICIONAL
      // const response = await fetch('/api/offers', { method: 'POST', body: JSON.stringify(offer) });
      // if (!response.ok) throw new Error('Error al publicar');
      
      console.log("[Mock API] Publicando oferta:", offer);
      toast.success("Oferta publicada en el marketplace de Mango App", {
        description: "Los compradores cercanos podrán ver tu cotización.",
      });
    } catch (error) {
      console.error("Falló la sincronización, guardando en cola:", error);
      queueOffer(offer);
    }
  };

  const flushQueue = async () => {
    const currentQueue: OfferPayload[] = JSON.parse(
      localStorage.getItem("offer_queue") || "[]"
    );

    if (currentQueue.length === 0) return;

    toast.info(`Sincronizando ${currentQueue.length} ofertas pendientes...`);
    
    // Procesamos la cola
    const successful: OfferPayload[] = [];
    
    for (const offer of currentQueue) {
      try {
        // AQUÍ IRÁ LA LLAMADA AL BACKEND TRADICIONAL
        console.log("[Mock API] Sincronizando oferta encolada:", offer);
        // Simulamos retardo de red
        await new Promise(resolve => setTimeout(resolve, 500));
        successful.push(offer);
      } catch (error) {
        console.error("Error sincronizando oferta", offer, error);
      }
    }

    // Filtramos las que sí pasaron y dejamos las que fallaron
    const pendingQueue = currentQueue.filter(
      (o) => !successful.find((s) => s.id === o.id)
    );
    
    localStorage.setItem("offer_queue", JSON.stringify(pendingQueue));

    if (successful.length > 0) {
      toast.success(`${successful.length} ofertas sincronizadas exitosamente.`);
    }
  };

  return {
    isOnline,
    publishOffer,
  };
}
