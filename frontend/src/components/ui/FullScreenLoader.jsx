
import { Loader2 } from "lucide-react";

const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-muted-foreground">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
};

export default FullScreenLoader;
