import { Package, Scale, DollarSign, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OfferCardData {
  product: string;
  quantity: string;
  price: string;
}

interface OfferCardProps {
  offer: OfferCardData;
  onPublish?: () => void;
  className?: string;
}

export function OfferCard({ offer, onPublish, className }: OfferCardProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="bg-mango-green px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Package className="h-3.5 w-3.5" />
          Cotización sugerida
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="flex items-start gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mango-green-light text-mango-green-dark">
            <Package className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Producto
            </p>
            <p className="text-sm font-semibold text-foreground">{offer.product}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mango-green-light text-mango-green-dark">
            <Scale className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Cantidad
            </p>
            <p className="text-sm font-semibold text-foreground">{offer.quantity}</p>
          </div>
        </div>

        <div className="col-span-2 flex items-start gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mango-orange/15 text-mango-orange-dark">
            <DollarSign className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Precio sugerido
            </p>
            <p className="text-sm font-semibold text-foreground">{offer.price}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={onPublish}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-mango-orange py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-mango-orange-dark active:scale-[0.98]"
        >
          <Truck className="h-4 w-4" />
          Publicar Oferta
        </button>
      </div>
    </div>
  );
}
